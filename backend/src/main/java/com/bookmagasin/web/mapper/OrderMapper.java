package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.User;
import com.bookmagasin.web.dto.OrderDto;
import com.bookmagasin.web.dtoResponse.OrderResponseDto;
import java.util.List;
import java.util.stream.Collectors;

import com.bookmagasin.web.dtoResponse.OrderItemResponseDto;
import com.bookmagasin.web.dtoResponse.OrderStatusHistoryResponseDto;
import com.bookmagasin.web.mapper.OrderItemMapper;
import com.bookmagasin.web.mapper.OrderStatusHistoryMapper;

public class OrderMapper {

    public static OrderResponseDto toResponseDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setNote(order.getNote());
        dto.setStatus(order.getStatus());
        dto.setOrderDate(order.getOrderDate());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setTotalPrice(order.getTotalPrice());

        if (order.getUser() != null)
            dto.setUserFullName(order.getUser().getFullName());

        if (order.getService() != null)
            dto.setServiceName(order.getService().getNameService());

        if (order.getPayment() != null) {
            dto.setPaymentAmount(order.getPayment().getAmount());
            dto.setPaymentMethod(order.getPayment().getMethod().name()); // ⚙️ đổi ở đây
            dto.setPaymentStatus(order.getPayment().getPaymentStatus().name()); // ⚙️ đổi ở đây

        }

        // ✅ Thêm ánh xạ danh sách sản phẩm
        if (order.getBooks() != null && !order.getBooks().isEmpty()) {
            List<OrderItemResponseDto> items = order.getBooks()
                    .stream()
                    .map(OrderItemMapper::toResponseDto)
                    .collect(Collectors.toList());
            dto.setItems(items);
        }

        // ✅ Thêm ánh xạ lịch sử trạng thái đơn hàng
        if (order.getOrderStatusHistories() != null && !order.getOrderStatusHistories().isEmpty()) {
            List<OrderStatusHistoryResponseDto> histories = order.getOrderStatusHistories()
                    .stream()
                    .map(OrderStatusHistoryMapper::toResponseDto)
                    .collect(Collectors.toList());
            dto.setOrderStatusHistories(histories);
        }

        return dto;
    }
}

