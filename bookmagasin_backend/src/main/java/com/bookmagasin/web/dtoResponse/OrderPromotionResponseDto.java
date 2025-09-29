package com.bookmagasin.web.dtoResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderPromotionResponseDto {
    private int id;
    private int orderId;
    private int promotionId;
    private double discountAmount;
}
