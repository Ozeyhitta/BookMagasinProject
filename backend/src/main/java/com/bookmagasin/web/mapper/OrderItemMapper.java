package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.OrderItem;
import com.bookmagasin.web.dto.OrderItemDto;
import com.bookmagasin.web.dtoResponse.OrderItemResponseDto;
public class OrderItemMapper {

    public static OrderItemResponseDto toResponseDto(OrderItem orderItem) {
        OrderItemResponseDto dto = new OrderItemResponseDto();
        dto.setId(orderItem.getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());

        if (orderItem.getBook() != null) {
            dto.setBookId(orderItem.getBook().getId());
            dto.setBookTitle(orderItem.getBook().getTitle());
            dto.setBookPrice(orderItem.getBook().getSellingPrice());
            if (orderItem.getBook().getBookDetail() != null) {
                dto.setBookImageUrl(orderItem.getBook().getBookDetail().getImageUrl());
            }
        }

        return dto;
    }

    public static OrderItem toEntity(OrderItemDto dto, Book book, Order order) {
        OrderItem entity = new OrderItem();
        entity.setBook(book);
        entity.setOrder(order);
        entity.setQuantity(dto.getQuantity());
        entity.setPrice(dto.getPrice());
        return entity;
    }
}

