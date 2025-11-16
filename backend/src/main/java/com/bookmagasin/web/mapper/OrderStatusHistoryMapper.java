package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.OrderStatusHistory;
import com.bookmagasin.web.dtoResponse.OrderStatusHistoryResponseDto;

public class OrderStatusHistoryMapper {
    
    public static OrderStatusHistoryResponseDto toResponseDto(OrderStatusHistory history) {
        OrderStatusHistoryResponseDto dto = new OrderStatusHistoryResponseDto();
        dto.setId(history.getId());
        dto.setEOrderHistory(history.getEOrderHistory());
        dto.setStatusChangeDate(history.getStatusChangeDate());
        return dto;
    }
}

