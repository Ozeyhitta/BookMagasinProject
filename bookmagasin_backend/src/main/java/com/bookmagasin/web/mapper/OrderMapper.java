package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.User;
import com.bookmagasin.web.dto.OrderDto;
import com.bookmagasin.web.dtoResponse.OrderResponseDto;

public class OrderMapper {

    public static OrderResponseDto toResponseDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setNote(order.getNote());
        dto.setStatus(order.getStatus());
        dto.setOrderDate(order.getOrderDate());

        if (order.getUser() != null)
            dto.setUserFullName(order.getUser().getFullName());

        if (order.getService() != null)
            dto.setServiceName(order.getService().getNameService());

        if (order.getPayment() != null) {
            dto.setPaymentAmount(order.getPayment().getAmount());
            dto.setPaymentMethod(order.getPayment().getMethod());
            dto.setPaymentStatus(order.getPayment().getPaymentStatus());
        }

        return dto;
    }
}
