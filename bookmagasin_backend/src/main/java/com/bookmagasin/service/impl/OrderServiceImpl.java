package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.Payment;
import com.bookmagasin.entity.User;
import com.bookmagasin.repository.OrderRepository;
import com.bookmagasin.repository.PaymentRepository;
import com.bookmagasin.repository.ServiceRepository;
import com.bookmagasin.repository.UserRepository;
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

    public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository, ServiceRepository serviceRepository, PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.paymentRepository = paymentRepository;
    }


    @Override
    public OrderResponseDto createOrder(OrderDto dto) {
        Order order=new Order();
        User user= userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);

        com.bookmagasin.entity.Service service=serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));
        order.setService(service);

        Payment payment = paymentRepository.findById(dto.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        order.setPayment(payment);

        order.setNote(dto.getNote());
        order.setStatus(dto.getStatus());
        order.setOrderDate(dto.getOrderDate());

        Order saved = orderRepository.save(order);
        return OrderMapper.toResponseDto(saved);
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
