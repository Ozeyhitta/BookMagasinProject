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
    private Date startDate;
    private Date endDate;
}
