package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.Payment;
import com.bookmagasin.entity.Service;
import com.bookmagasin.entity.User;
import com.bookmagasin.enums.EStatusBooking;
import com.bookmagasin.web.dto.OrderDto;
import com.bookmagasin.web.dtoResponse.OrderResponseDto;

import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

import com.bookmagasin.web.dtoResponse.OrderItemResponseDto;
import com.bookmagasin.web.dtoResponse.OrderStatusHistoryResponseDto;
import com.bookmagasin.web.mapper.OrderItemMapper;
import com.bookmagasin.web.mapper.OrderStatusHistoryMapper;
import org.aspectj.weaver.ast.Or;
public class OrderMapper {

    public static Order toEntity(OrderDto dto, User user, Service service, Payment payment) {
        Order order = new Order();
        order.setUser(user);
        order.setService(service);
        order.setPayment(payment);
        order.setStatus(dto.getStatus());
        order.setNote(dto.getNote());
        order.setOrderDate(dto.getOrderDate());
        order.setShippingAddress(dto.getShippingAddress());
        order.setPhoneNumber(dto.getPhoneNumber());

        return order;
    }


    public static OrderResponseDto toResponseDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setNote(order.getNote());
        dto.setStatus(order.getStatus());
        dto.setOrderDate(order.getOrderDate());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setTotalPrice(order.getTotalPrice());

        // User info
        if (order.getUser() != null)
            dto.setUserFullName(order.getUser().getFullName());

        // Service info
        if (order.getService() != null)
            dto.setServiceName(order.getService().getNameService());

        // Payment info
        if (order.getPayment() != null) {
            dto.setPaymentAmount(order.getPayment().getAmount());
            dto.setPaymentMethod(order.getPayment().getMethod().name());
            dto.setPaymentStatus(order.getPayment().getPaymentStatus().name());
        }

        // Order Items
        if (order.getBooks() != null)
            dto.setItems(order.getBooks().stream()
                    .map(OrderItemMapper::toResponseDto)
                    .collect(Collectors.toList()));

        // Order Status History
        if (order.getOrderStatusHistories() != null)
            dto.setOrderStatusHistories(order.getOrderStatusHistories().stream()
                    .map(OrderStatusHistoryMapper::toResponseDto)
                    .collect(Collectors.toList()));

        return dto;
    }
}
