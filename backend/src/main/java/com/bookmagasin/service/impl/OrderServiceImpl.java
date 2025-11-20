package com.bookmagasin.service.impl;

import com.bookmagasin.entity.*;
import com.bookmagasin.enums.EOrderHistory;
import com.bookmagasin.enums.EStatusBooking;
import com.bookmagasin.repository.*;
import com.bookmagasin.service.OrderService;
import com.bookmagasin.web.dto.OrderDto;
import com.bookmagasin.web.dtoResponse.OrderResponseDto;
import com.bookmagasin.web.mapper.OrderMapper;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    private BookRepository bookRepository;
    private OrderItemRepository orderItemRepository;
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository, ServiceRepository serviceRepository, PaymentRepository paymentRepository, BookRepository bookRepository, OrderItemRepository orderItemRepository, OrderStatusHistoryRepository orderStatusHistoryRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.paymentRepository = paymentRepository;
        this.bookRepository = bookRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
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

        // ✅ Chuyển String → Enum
        if (dto.getStatus() != null) {
            order.setStatus(dto.getStatus());
        } else {
            order.setStatus(EStatusBooking.PENDING);
        }


        // Parse orderDate từ String hoặc Date
        if (dto.getOrderDate() != null) {
            order.setOrderDate(dto.getOrderDate());
        } else {
            // Nếu không có orderDate, set ngày hiện tại
            order.setOrderDate(LocalDateTime.now());
        }
        order.setShippingAddress(dto.getShippingAddress());
        order.setPhoneNumber(dto.getPhoneNumber());

        // ✅ Tính tổng tiền từ giỏ hàng
        double totalPrice = 0.0;
        if (dto.getOrderItems() != null) {
            totalPrice = dto.getOrderItems().stream()
                    .mapToDouble(item -> item.getPrice() * item.getQuantity())
                    .sum();
        }
        order.setTotalPrice(totalPrice);

        // ✅ Lưu order chính
        Order savedOrder = orderRepository.save(order);
        // Flush để đảm bảo order có ID trước khi tạo OrderStatusHistory
        orderRepository.flush();

        // ✅ Lưu danh sách sản phẩm (OrderItem)
        if (dto.getOrderItems() != null && !dto.getOrderItems().isEmpty()) {
            List<OrderItem> items = dto.getOrderItems().stream().map(itemDto -> {
                Book book = bookRepository.findById(itemDto.getBookId())
                        .orElseThrow(() -> new RuntimeException("Book not found"));

                OrderItem orderItem = new OrderItem();
                orderItem.setBook(book);
                orderItem.setOrder(savedOrder);
                orderItem.setQuantity(itemDto.getQuantity());
                orderItem.setPrice(itemDto.getPrice());

                return orderItem;
            }).collect(Collectors.toList());

            orderItemRepository.saveAll(items);
            savedOrder.setBooks(items); // gán ngược lại để mapper có thể lấy danh sách
        }

        // ✅ Tạo OrderStatusHistory đầu tiên khi tạo order mới
        try {
            OrderStatusHistory initialHistory = new OrderStatusHistory();
            // Map EStatusBooking sang EOrderHistory
            EOrderHistory initialStatus = mapStatusToOrderHistory(savedOrder.getStatus());
            initialHistory.setEOrderHistory(initialStatus);
            initialHistory.setStatusChangeDate(new Date());
            initialHistory.setOrder(savedOrder);
            
            // Đảm bảo Order có danh sách orderStatusHistories được khởi tạo
            if (savedOrder.getOrderStatusHistories() == null) {
                savedOrder.setOrderStatusHistories(new java.util.ArrayList<>());
            }
            savedOrder.getOrderStatusHistories().add(initialHistory);
            
            // Lưu OrderStatusHistory
            OrderStatusHistory savedHistory = orderStatusHistoryRepository.save(initialHistory);
            orderStatusHistoryRepository.flush(); // Flush để đảm bảo lưu vào DB
            System.out.println("✅ OrderStatusHistory created: ID=" + savedHistory.getId() + 
                             ", OrderID=" + savedOrder.getId() + 
                             ", Status=" + savedHistory.getEOrderHistory());
        } catch (Exception e) {
            System.err.println("❌ Error creating OrderStatusHistory: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create OrderStatusHistory for order: " + savedOrder.getId(), e);
        }

        // ✅ Trả về response
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
        // Trigger lazy loading của orderStatusHistories trong cùng transaction
        // @BatchSize sẽ tự động fetch tất cả orderStatusHistories trong batch
        orders.forEach(order -> {
            if (order.getOrderStatusHistories() != null) {
                order.getOrderStatusHistories().size(); // Trigger lazy load
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

        // Cập nhật trạng thái đơn hàng
        EStatusBooking status = EStatusBooking.valueOf(newStatus.trim().toUpperCase());
        order.setStatus(status);
        Order savedOrder = orderRepository.save(order);
        orderRepository.flush(); // Flush để đảm bảo order được lưu

        // ✅ Tạo OrderStatusHistory mới khi cập nhật trạng thái
        try {
            OrderStatusHistory newHistory = new OrderStatusHistory();
            EOrderHistory orderHistoryStatus = mapStatusToOrderHistory(status);
            newHistory.setEOrderHistory(orderHistoryStatus);
            newHistory.setStatusChangeDate(new Date());
            newHistory.setOrder(savedOrder);
            
            // Đảm bảo Order có danh sách orderStatusHistories được khởi tạo
            if (savedOrder.getOrderStatusHistories() == null) {
                savedOrder.setOrderStatusHistories(new java.util.ArrayList<>());
            }
            savedOrder.getOrderStatusHistories().add(newHistory);
            
            // Lưu OrderStatusHistory
            OrderStatusHistory savedHistory = orderStatusHistoryRepository.save(newHistory);
            orderStatusHistoryRepository.flush(); // Flush để đảm bảo lưu vào DB
            System.out.println("✅ OrderStatusHistory updated: ID=" + savedHistory.getId() + 
                             ", OrderID=" + savedOrder.getId() + 
                             ", Status=" + orderHistoryStatus);
        } catch (Exception e) {
            System.err.println("❌ Error creating OrderStatusHistory: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create OrderStatusHistory for order: " + savedOrder.getId(), e);
        }

        return OrderMapper.toResponseDto(savedOrder);
    }

    // ✅ Helper method để map EStatusBooking sang EOrderHistory
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
}
