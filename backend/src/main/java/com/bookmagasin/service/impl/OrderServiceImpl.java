package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.Notification;
import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.OrderItem;
import com.bookmagasin.entity.OrderStatusHistory;
import com.bookmagasin.entity.Payment;
import com.bookmagasin.entity.User;
import com.bookmagasin.entity.UserNotification;
import com.bookmagasin.entity.UserNotificationId;
import com.bookmagasin.enums.EOrderHistory;
import com.bookmagasin.enums.EStatusBooking;
import com.bookmagasin.repository.BookRepository;
import com.bookmagasin.repository.NotificationRepository;
import com.bookmagasin.repository.OrderItemRepository;
import com.bookmagasin.repository.OrderRepository;
import com.bookmagasin.repository.OrderStatusHistoryRepository;
import com.bookmagasin.repository.PaymentRepository;
import com.bookmagasin.repository.ServiceRepository;
import com.bookmagasin.repository.UserNotificationRepository;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.service.OrderService;
import com.bookmagasin.web.dto.OrderDto;
import com.bookmagasin.web.dto.OrderItemDto;
import com.bookmagasin.web.dtoResponse.OrderResponseDto;
import com.bookmagasin.web.mapper.OrderMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final PaymentRepository paymentRepository;
    private final BookRepository bookRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final NotificationRepository notificationRepository;
    private final UserNotificationRepository userNotificationRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            UserRepository userRepository,
                            ServiceRepository serviceRepository,
                            PaymentRepository paymentRepository,
                            BookRepository bookRepository,
                            OrderItemRepository orderItemRepository,
                            OrderStatusHistoryRepository orderStatusHistoryRepository,
                            NotificationRepository notificationRepository,
                            UserNotificationRepository userNotificationRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.paymentRepository = paymentRepository;
        this.bookRepository = bookRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.notificationRepository = notificationRepository;
        this.userNotificationRepository = userNotificationRepository;
    }

    @Override
    @Transactional
    public OrderResponseDto createOrder(OrderDto dto) {
        Order order = new Order();

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);

        com.bookmagasin.entity.Service service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));
        order.setService(service);

        Payment payment = paymentRepository.findById(dto.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        order.setPayment(payment);

        order.setNote(dto.getNote());
        order.setStatus(dto.getStatus() != null ? dto.getStatus() : EStatusBooking.PENDING);
        LocalDateTime orderDate = dto.getOrderDate() != null ? dto.getOrderDate() : LocalDateTime.now();
        order.setOrderDate(orderDate);
        order.setShippingAddress(dto.getShippingAddress());
        order.setPhoneNumber(dto.getPhoneNumber());

        List<OrderItem> pendingItems = new ArrayList<>();
        double totalPrice = 0.0;

        if (dto.getOrderItems() != null && !dto.getOrderItems().isEmpty()) {
            for (OrderItemDto itemDto : dto.getOrderItems()) {
                Book book = bookRepository.findById(itemDto.getBookId())
                        .orElseThrow(() -> new RuntimeException("Book not found with id " + itemDto.getBookId()));

                int requestedQty = itemDto.getQuantity();
                if (requestedQty <= 0) {
                    throw new RuntimeException("Quantity must be greater than 0 for " + book.getTitle());
                }

                int currentStock = book.getStockQuantity() != null ? book.getStockQuantity() : 0;
                if (currentStock < requestedQty) {
                    throw new RuntimeException("Sách \"" + book.getTitle() + "\" chỉ còn " + currentStock + " quyển.");
                }

                book.setStockQuantity(currentStock - requestedQty);
                bookRepository.save(book);

                double unitPrice = itemDto.getPrice() > 0 ? itemDto.getPrice() : book.getSellingPrice();
                totalPrice += unitPrice * requestedQty;

                OrderItem oi = new OrderItem();
                oi.setBook(book);
                oi.setQuantity(requestedQty);
                oi.setPrice(unitPrice);
                pendingItems.add(oi);
            }
        }

        order.setTotalPrice(totalPrice);

        Order savedOrder = orderRepository.save(order);
        orderRepository.flush();

        if (!pendingItems.isEmpty()) {
            pendingItems.forEach(oi -> oi.setOrder(savedOrder));
            orderItemRepository.saveAll(pendingItems);
            savedOrder.setBooks(pendingItems);
        }

        // create initial status history
        try {
            OrderStatusHistory initialHistory = new OrderStatusHistory();
            EOrderHistory initialStatus = mapStatusToOrderHistory(savedOrder.getStatus());
            initialHistory.setEOrderHistory(initialStatus);
            initialHistory.setStatusChangeDate(new Date());
            initialHistory.setOrder(savedOrder);

            if (savedOrder.getOrderStatusHistories() == null) {
                savedOrder.setOrderStatusHistories(new ArrayList<>());
            }
            savedOrder.getOrderStatusHistories().add(initialHistory);

            orderStatusHistoryRepository.save(initialHistory);
            orderStatusHistoryRepository.flush();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create OrderStatusHistory for order: " + savedOrder.getId(), e);
        }

        // notify staff
        try {
            Notification noti = new Notification();
            noti.setTitle("Có đơn hàng mới #" + savedOrder.getId());
            String customerName = (savedOrder.getUser() != null)
                    ? savedOrder.getUser().getFullName()
                    : "Khách hàng";
            String msg = customerName +
                    " vừa tạo đơn hàng #" + savedOrder.getId() +
                    " với tổng tiền " + savedOrder.getTotalPrice() + "đ.";
            noti.setMessage(msg);
            noti.setType("STAFF");
            noti.setSendDate(new Date());

            notificationRepository.save(noti);
        } catch (Exception ignored) {
        }

        return OrderMapper.toResponseDto(savedOrder);
    }

    @Override
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(OrderMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<OrderResponseDto> getOrderById(Integer id) {
        return orderRepository.findById(id)
                .map(OrderMapper::toResponseDto);
    }

    @Override
    public void deleteOrderById(Integer id) {
        orderRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> findByUserId(Integer userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
        orders.forEach(order -> {
            if (order.getOrderStatusHistories() != null) {
                order.getOrderStatusHistories().size();
            }
        });
        return orders.stream()
                .map(OrderMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponseDto updateOrderStatus(Integer orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        EStatusBooking status = EStatusBooking.valueOf(newStatus.trim().toUpperCase());
        order.setStatus(status);
        Order savedOrder = orderRepository.save(order);
        orderRepository.flush();

        try {
            OrderStatusHistory newHistory = new OrderStatusHistory();
            EOrderHistory orderHistoryStatus = mapStatusToOrderHistory(status);
            newHistory.setEOrderHistory(orderHistoryStatus);
            newHistory.setStatusChangeDate(new Date());
            newHistory.setOrder(savedOrder);

            if (savedOrder.getOrderStatusHistories() == null) {
                savedOrder.setOrderStatusHistories(new ArrayList<>());
            }
            savedOrder.getOrderStatusHistories().add(newHistory);

            orderStatusHistoryRepository.save(newHistory);
            orderStatusHistoryRepository.flush();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create OrderStatusHistory for order: " + savedOrder.getId(), e);
        }

        // notify customer
        try {
            if (savedOrder.getUser() != null) {
                Notification noti = new Notification();
                noti.setTitle("Đơn hàng #" + savedOrder.getId() + " đã được cập nhật");
                noti.setMessage("Trạng thái mới: " + status.name());
                noti.setType("CUSTOMER");
                noti.setSendDate(new Date());
                Notification savedNoti = notificationRepository.save(noti);

                UserNotification un = new UserNotification();
                un.setId(new UserNotificationId(savedOrder.getUser().getId(), savedNoti.getId()));
                un.setUser(savedOrder.getUser());
                un.setNotification(savedNoti);
                un.setRead(false);
                un.setReadAt(null);
                userNotificationRepository.save(un);
            }
        } catch (Exception e) {
            System.err.println("Warning: failed to create customer notification: " + e.getMessage());
        }

        return OrderMapper.toResponseDto(savedOrder);
    }

    private EOrderHistory mapStatusToOrderHistory(EStatusBooking status) {
        if (status == null) {
            return EOrderHistory.PENDING;
        }

        switch (status) {
            case PENDING:
                return EOrderHistory.PENDING;
            case CONFIRMED:
            case INPROGRESS:
                return EOrderHistory.PROCESSING;
            case COMPLETED:
                return EOrderHistory.DELIVERED;
            case CANCELLED:
                return EOrderHistory.CANCELLED;
            default:
                return EOrderHistory.PENDING;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> searchOrders(String status, String paymentMethod, String query, String sortBy) {
        EStatusBooking statusEnum = null;
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            statusEnum = EStatusBooking.valueOf(status.trim().toUpperCase());
        }

        com.bookmagasin.enums.EMethod paymentEnum = null;
        if (paymentMethod != null && !paymentMethod.isBlank() && !"ALL".equalsIgnoreCase(paymentMethod)) {
            paymentEnum = com.bookmagasin.enums.EMethod.valueOf(paymentMethod.trim().toUpperCase());
        }

        String keyword = (query == null || query.isBlank()) ? null : query.trim().toLowerCase();

        final EStatusBooking statusFilter = statusEnum;
        final com.bookmagasin.enums.EMethod paymentFilter = paymentEnum;
        final String keywordFilter = keyword;
        final String sortKey = sortBy;

        List<Order> orders = orderRepository.findAllLightweight();

        List<Order> filtered = orders.stream()
                .filter(o -> statusFilter == null || o.getStatus() == statusFilter)
                .filter(o -> paymentFilter == null || (o.getPayment() != null && paymentFilter.equals(o.getPayment().getMethod())))
                .filter(o -> {
                    if (keywordFilter == null) return true;
                    String idString = String.valueOf(o.getId());
                    String customer = o.getUser() != null ? o.getUser().getFullName() : "";
                    return idString.contains(keywordFilter) || customer.toLowerCase().contains(keywordFilter);
                })
                .sorted((a, b) -> {
                    if ("amount-desc".equalsIgnoreCase(sortKey)) {
                        return Double.compare(
                                b.getTotalPrice() != null ? b.getTotalPrice() : 0,
                                a.getTotalPrice() != null ? a.getTotalPrice() : 0
                        );
                    }
                    if ("amount-asc".equalsIgnoreCase(sortKey)) {
                        return Double.compare(
                                a.getTotalPrice() != null ? a.getTotalPrice() : 0,
                                b.getTotalPrice() != null ? b.getTotalPrice() : 0
                        );
                    }
                    LocalDateTime dateA = a.getOrderDate();
                    LocalDateTime dateB = b.getOrderDate();
                    if (dateA == null || dateB == null) return 0;
                    return dateB.compareTo(dateA);
                })
                .toList();

        return filtered.stream()
                .map(OrderMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrderResponseDto> getDetailedOrder(Integer id) {
        return orderRepository.findByIdWithDetails(id)
                .map(OrderMapper::toResponseDto);
    }
}
