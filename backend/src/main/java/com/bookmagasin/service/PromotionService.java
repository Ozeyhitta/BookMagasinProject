package com.bookmagasin.service;

import com.bookmagasin.web.dto.PromotionDto;
import com.bookmagasin.web.dtoResponse.PromotionResponseDto;
import java.util.List;
import java.util.Optional;

public interface PromotionService {
    PromotionResponseDto create(PromotionDto dto);
    List<PromotionResponseDto> getAll();
    Optional<PromotionResponseDto> getById(int id);
    PromotionResponseDto update(int id, PromotionDto dto);
    void delete(int id);

    PromotionResponseDto applyPromotion(String code, double totalAmount);
}
