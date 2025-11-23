package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.BookDiscount;
import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.OrderItem;
import com.bookmagasin.web.dto.OrderItemDto;
import com.bookmagasin.web.dtoResponse.OrderItemResponseDto;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public class OrderItemMapper {

    public static OrderItemResponseDto toResponseDto(OrderItem orderItem) {
        OrderItemResponseDto dto = new OrderItemResponseDto();
        dto.setId(orderItem.getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());

        if (orderItem.getBook() != null) {
<<<<<<< HEAD
            dto.setBookId(orderItem.getBook().getId());
            dto.setBookTitle(orderItem.getBook().getTitle());
            dto.setBookPrice(orderItem.getBook().getSellingPrice());
            if (orderItem.getBook().getBookDetail() != null) {
                dto.setBookImageUrl(orderItem.getBook().getBookDetail().getImageUrl());
=======
            Book book = orderItem.getBook();
            dto.setBookId(book.getId());
            dto.setBookTitle(book.getTitle());
            dto.setBookPrice(book.getSellingPrice());
            
            // Lấy imageUrl từ BookDetail
            if (book.getBookDetail() != null) {
                dto.setImageUrl(book.getBookDetail().getImageUrl());
            }
            
            // Lấy discount active hiện tại
            if (book.getBookDiscounts() != null && !book.getBookDiscounts().isEmpty()) {
                Optional<BookDiscount> activeDiscount = book.getBookDiscounts().stream()
                        .filter(d -> isActive(d.getStartDate(), d.getEndDate()))
                        .max(Comparator.comparing(BookDiscount::getStartDate, 
                                Comparator.nullsFirst(Comparator.naturalOrder())));
                
                if (activeDiscount.isPresent()) {
                    BookDiscount discount = activeDiscount.get();
                    dto.setDiscountPercent(discount.getDiscountPercent());
                    dto.setDiscountAmount(discount.getDiscountAmount());
                }
>>>>>>> 8dcf7faa58b9f62866a8b49037d2aaa993a3854b
            }
        }

        return dto;
    }
    
    private static boolean isActive(Date start, Date end) {
        Date now = new Date();
        boolean afterStart = start == null || !now.before(start);
        boolean beforeEnd = end == null || !now.after(end);
        return afterStart && beforeEnd;
    }

    public static OrderItem toEntity(OrderItemDto dto, Book book, Order order) {
        OrderItem entity = new OrderItem();
        entity.setBook(book);
        entity.setOrder(order);
        entity.setQuantity(dto.getQuantity());
        entity.setPrice(dto.getPrice());
        return entity;
    }
}

