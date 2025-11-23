package com.bookmagasin.web.dtoResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponseDto {
    private int id;
    private int quantity;
    private double price;

    private int bookId;
    private String bookTitle;
    private double bookPrice;
<<<<<<< HEAD
    private String bookImageUrl;
=======
    
    // Thông tin từ BookDetail
    private String imageUrl;
    
    // Thông tin discount hiện tại
    private Double discountPercent;
    private Double discountAmount;
>>>>>>> 8dcf7faa58b9f62866a8b49037d2aaa993a3854b
}
