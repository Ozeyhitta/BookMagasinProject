package com.bookmagasin.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
