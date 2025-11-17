package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Promotion;
import com.bookmagasin.web.dto.PromotionDto;
import com.bookmagasin.web.dtoResponse.PromotionResponseDto;

public class PromotionMapper {
    public static Promotion toEntity(PromotionDto dto) {
        Promotion promotion = new Promotion();
        promotion.setName(dto.getName());
        promotion.setDiscountPercent(dto.getDiscountPercent());
        promotion.setCode(dto.getCode());
        promotion.setMaxDiscount(dto.getMaxDiscount());
        promotion.setStartDate(dto.getStartDate());
        promotion.setEndDate(dto.getEndDate());
        return promotion;
    }

    public static PromotionResponseDto toResponseDto(Promotion promotion) {
        PromotionResponseDto dto = new PromotionResponseDto();
        dto.setId(promotion.getId());
        dto.setName(promotion.getName());
        dto.setDiscountPercent(promotion.getDiscountPercent());
        dto.setCode(promotion.getCode());
        dto.setMaxDiscount(promotion.getMaxDiscount());
        dto.setStartDate(promotion.getStartDate());
        dto.setEndDate(promotion.getEndDate());
        return dto;
    }
}
