package com.bookmagasin.service.impl;

import com.bookmagasin.entity.*;
import com.bookmagasin.enums.EStatusBooking;
import com.bookmagasin.repository.*;
import com.bookmagasin.service.OrderService;
import com.bookmagasin.web.dto.OrderDto;
import com.bookmagasin.web.dtoResponse.OrderResponseDto;
import com.bookmagasin.web.mapper.OrderMapper;
import org.springframework.stereotype.Service;

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

    public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository, ServiceRepository serviceRepository, PaymentRepository paymentRepository, BookRepository bookRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.paymentRepository = paymentRepository;
        this.bookRepository = bookRepository;
        this.orderItemRepository = orderItemRepository;
    }


    @Override
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
            order.setStatus(EStatusBooking.valueOf(dto.getStatus().trim().toUpperCase()));
        } else {
            order.setStatus(EStatusBooking.PENDING);
        }


        order.setOrderDate(dto.getOrderDate());
        order.setShippingAddress(dto.getShippingAddress());
        order.setPhoneNumber(dto.getPhoneNumber());

        // ✅ Tính tổng tiền từ giỏ hàng
        double totalPrice = 0.0;
        if (dto.getCartItems() != null) {
            totalPrice = dto.getCartItems().stream()
                    .mapToDouble(item -> item.getPrice() * item.getQuantity())
                    .sum();
        }
        order.setTotalPrice(totalPrice);

        // ✅ Lưu order chính
        Order savedOrder = orderRepository.save(order);

        // ✅ Lưu danh sách sản phẩm (OrderItem)
        if (dto.getCartItems() != null && !dto.getCartItems().isEmpty()) {
            List<OrderItem> items = dto.getCartItems().stream().map(itemDto -> {
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
}
