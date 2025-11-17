package com.bookmagasin.web.dtoResponse;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionResponseDto {
    private int id;
    private String name;
    private double discountPercent;
    private String code;
    private Double maxDiscount;
    private Date startDate;
    private Date endDate;
    private Double discountAmount;
    private Double finalAmount;
}

