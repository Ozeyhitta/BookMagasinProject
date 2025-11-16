package com.bookmagasin.service;

import com.bookmagasin.web.dto.OrderItemDto;
import com.bookmagasin.web.dtoResponse.OrderItemResponseDto;

import java.util.List;
import java.util.Optional;

public interface OrderItemService {
    OrderItemResponseDto createOrderItem(OrderItemDto dto);
    List<OrderItemResponseDto> getOrderItemsByOrderId(Integer orderId);
    Optional<OrderItemResponseDto> getOrderItemById(Integer id);
    OrderItemResponseDto updateOrderItem(Integer id, OrderItemDto dto);
    void deleteOrderItem(Integer id);

    List<OrderItemResponseDto> getAllOrderItems();
}


