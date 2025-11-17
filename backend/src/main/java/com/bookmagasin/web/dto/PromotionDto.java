package com.bookmagasin.web.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionDto {
    private String name;
    private double discountPercent;
    private String code;
    private double maxDiscount;
    private Date startDate;
    private Date endDate;
}
