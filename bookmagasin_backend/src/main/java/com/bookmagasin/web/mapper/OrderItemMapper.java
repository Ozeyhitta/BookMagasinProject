package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.OrderItem;
import com.bookmagasin.web.dto.OrderItemDto;
import com.bookmagasin.web.dtoResponse.OrderItemResponseDto;

public class OrderItemMapper {

    public static OrderItemResponseDto toResponseDto(OrderItem orderItem) {
        return new OrderItemResponseDto(
                orderItem.getId(),
                orderItem.getQuantity(),
                orderItem.getPrice(),
                orderItem.getBook() != null ? orderItem.getBook().getId() : 0,
                orderItem.getBook() != null ? orderItem.getBook().getTitle() : null,
                orderItem.getBook() != null ? orderItem.getBook().getSellingPrice() : 0,
                orderItem.getOrder() != null ? orderItem.getOrder().getId() : 0
        );
    }

    public static OrderItem toEntity(OrderItemDto dto, Book book, Order order) {
        OrderItem orderItem = new OrderItem();
        orderItem.setBook(book);
        orderItem.setOrder(order);
        orderItem.setQuantity(dto.getQuantity());
        orderItem.setPrice(dto.getPrice());
        return orderItem;
    }
}

