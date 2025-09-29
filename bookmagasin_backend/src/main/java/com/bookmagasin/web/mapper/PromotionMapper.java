package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Promotion;
import com.bookmagasin.web.dto.PromotionDto;
import com.bookmagasin.web.dtoResponse.PromotionResponseDto;

public class PromotionMapper {
    public static Promotion toEntity(PromotionDto dto) {
        Promotion promotion = new Promotion();
        promotion.setName(dto.getName());
        promotion.setDiscountPercent(dto.getDiscountPercent());
        promotion.setStartDate(dto.getStartDate());
        promotion.setEndDate(dto.getEndDate());
        return promotion;
    }

    public static PromotionResponseDto toResponseDto(Promotion promotion) {
        return new PromotionResponseDto(
                promotion.getId(),
                promotion.getName(),
                promotion.getDiscountPercent(),
                promotion.getStartDate(),
                promotion.getEndDate()
        );
    }
}
