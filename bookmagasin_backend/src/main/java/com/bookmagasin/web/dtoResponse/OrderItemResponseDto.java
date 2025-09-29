package com.bookmagasin.web.dtoResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponseDto {
    private int id;
    private int quantity;
    private double price;

    private int bookId;
    private String bookTitle;
    private double bookPrice;

    private int orderId;
}
