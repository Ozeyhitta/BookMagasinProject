package com.bookmagasin.service;

import com.bookmagasin.web.dto.OrderDto;
import com.bookmagasin.web.dtoResponse.OrderResponseDto;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    OrderResponseDto createOrder(OrderDto dto);
    List<OrderResponseDto> getAllOrders();
    Optional<OrderResponseDto> getOrderById(Integer id);
    void deleteOrderById(Integer id);
}

