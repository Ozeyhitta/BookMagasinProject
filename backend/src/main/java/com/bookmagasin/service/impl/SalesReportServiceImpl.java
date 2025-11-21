package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.Category;
import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.OrderItem;
import com.bookmagasin.enums.EStatusBooking;
import com.bookmagasin.repository.OrderRepository;
import com.bookmagasin.service.SalesReportService;
import com.bookmagasin.web.dtoResponse.CategoryRevenueDto;
import com.bookmagasin.web.dtoResponse.SalesReportResponseDto;
import com.bookmagasin.web.dtoResponse.SeriesPointDto;
import com.bookmagasin.web.dtoResponse.TopBookDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SalesReportServiceImpl implements SalesReportService {

    private final OrderRepository orderRepository;

    public SalesReportServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public SalesReportResponseDto buildSalesReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime end = endDate != null ? endDate.atTime(LocalTime.MAX) : null;

        List<Order> orders = orderRepository.findWithItemsByDateRange(start, end);

        double totalRevenue = 0d;
        long totalOrders = orders.size();
        long totalReturns = orders.stream().filter(o -> o.getStatus() == EStatusBooking.CANCELLED).count();
        Set<Integer> customerIds = new HashSet<>();

        Map<String, SeriesPointDto> seriesMap = new LinkedHashMap<>();
        Map<String, Double> categoryRevenue = new HashMap<>();
        Map<Integer, TopBookDto> topBooks = new HashMap<>();

        DateTimeFormatter labelFmt = DateTimeFormatter.ofPattern("yyyy-MM");

        for (Order order : orders) {
            if (order.getUser() != null) {
                customerIds.add(order.getUser().getId());
            }

            double orderRevenue = order.getTotalPrice() != null ? order.getTotalPrice() : 0d;
            if ((order.getBooks() != null && !order.getBooks().isEmpty()) && order.getTotalPrice() == null) {
                orderRevenue = order.getBooks().stream()
                        .mapToDouble(oi -> safePrice(oi) * oi.getQuantity())
                        .sum();
            }
            totalRevenue += orderRevenue;

            LocalDateTime od = order.getOrderDate() != null ? order.getOrderDate() : LocalDateTime.now();
            String label = od.format(labelFmt);
            SeriesPointDto point = seriesMap.getOrDefault(label, new SeriesPointDto(label, 0d, 0));
            point.setRevenue(point.getRevenue() + orderRevenue);
            point.setOrders(point.getOrders() + 1);
            seriesMap.put(label, point);

            if (order.getBooks() != null) {
                for (OrderItem item : order.getBooks()) {
                    double itemRevenue = safePrice(item) * item.getQuantity();
                    Book book = item.getBook();
                    if (book != null && book.getCategories() != null && !book.getCategories().isEmpty()) {
                        for (Category c : book.getCategories()) {
                            String catName = c.getName() != null ? c.getName() : "Khác";
                            categoryRevenue.put(catName, categoryRevenue.getOrDefault(catName, 0d) + itemRevenue);
                        }
                    } else {
                        categoryRevenue.put("Khác", categoryRevenue.getOrDefault("Khác", 0d) + itemRevenue);
                    }

                    if (book != null) {
                        TopBookDto agg = topBooks.getOrDefault(
                                book.getId(),
                                new TopBookDto(book.getId(), book.getTitle(), 0L, 0d)
                        );
                        agg.setQuantity(agg.getQuantity() + item.getQuantity());
                        agg.setRevenue(agg.getRevenue() + itemRevenue);
                        topBooks.put(book.getId(), agg);
                    }
                }
            }
        }

        List<SeriesPointDto> series = new ArrayList<>(seriesMap.values());
        series.sort(Comparator.comparing(SeriesPointDto::getLabel));

        List<CategoryRevenueDto> categoryList = categoryRevenue.entrySet().stream()
                .map(e -> new CategoryRevenueDto(e.getKey(), e.getValue()))
                .sorted((a, b) -> Double.compare(b.getRevenue(), a.getRevenue()))
                .collect(Collectors.toList());

        List<TopBookDto> topBookList = topBooks.values().stream()
                .sorted((a, b) -> Double.compare(b.getRevenue(), a.getRevenue()))
                .limit(10)
                .collect(Collectors.toList());

        SalesReportResponseDto dto = new SalesReportResponseDto();
        dto.setTotalRevenue(totalRevenue);
        dto.setTotalOrders(totalOrders);
        dto.setTotalCustomers(customerIds.size());
        dto.setTotalReturns(totalReturns);
        dto.setRevenueSeries(series);
        dto.setCategoryBreakdown(categoryList);
        dto.setTopBooks(topBookList);
        return dto;
    }

    private double safePrice(OrderItem item) {
        return item.getPrice() != 0 ? item.getPrice() : (item.getBook() != null ? item.getBook().getSellingPrice() : 0d);
    }
}
