package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.OrderStatusHistory;
import com.bookmagasin.web.dto.OrderStatusHistoryDto;
import com.bookmagasin.web.dtoResponse.OrderStatusHistoryResponseDto;

public class OrderStatusHistoryMapper {
    
    public static OrderStatusHistoryResponseDto toResponseDto(OrderStatusHistory history) {
        OrderStatusHistoryResponseDto dto = new OrderStatusHistoryResponseDto();
        dto.setId(history.getId());
        dto.setEOrderHistory(history.getEOrderHistory());
        dto.setStatusChangeDate(history.getStatusChangeDate());
        
        // Set orderId nếu có
        if (history.getOrder() != null) {
            dto.setOrderId(history.getOrder().getId());
        }
        
        return dto;
    }
    
    public static OrderStatusHistory toEntity(OrderStatusHistoryDto dto) {
        OrderStatusHistory history = new OrderStatusHistory();
        history.setEOrderHistory(dto.getEOrderHistory());
        history.setStatusChangeDate(dto.getStatusChangeDate() != null 
            ? dto.getStatusChangeDate() 
            : new java.util.Date());
        return history;
    }
    
    public static void updateEntity(OrderStatusHistory existing, OrderStatusHistoryDto dto) {
        if (dto.getEOrderHistory() != null) {
            existing.setEOrderHistory(dto.getEOrderHistory());
        }
        if (dto.getStatusChangeDate() != null) {
            existing.setStatusChangeDate(dto.getStatusChangeDate());
        }
    }
}

