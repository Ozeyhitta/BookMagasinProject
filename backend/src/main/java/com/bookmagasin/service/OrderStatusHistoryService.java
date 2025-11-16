package com.bookmagasin.service;

import com.bookmagasin.web.dto.OrderStatusHistoryDto;
import com.bookmagasin.web.dtoResponse.OrderStatusHistoryResponseDto;

import java.util.List;
import java.util.Optional;

public interface OrderStatusHistoryService {
    // 🔵 Read
    List<OrderStatusHistoryResponseDto> findAll();
    Optional<OrderStatusHistoryResponseDto> findById(Integer id);
    List<OrderStatusHistoryResponseDto> findByOrderId(Integer orderId);
    
    // 🟢 Create
    OrderStatusHistoryResponseDto save(OrderStatusHistoryDto dto);
    
    // 🔴 Update
    OrderStatusHistoryResponseDto update(Integer id, OrderStatusHistoryDto dto);
    
    // ⚫ Delete
    void deleteById(Integer id);
}

