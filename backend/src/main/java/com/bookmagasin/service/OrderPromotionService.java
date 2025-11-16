package com.bookmagasin.service;


import com.bookmagasin.web.dto.OrderPromotionDto;
import com.bookmagasin.web.dtoResponse.OrderPromotionResponseDto;

import java.util.List;
import java.util.Optional;

public interface OrderPromotionService {
    OrderPromotionResponseDto create(OrderPromotionDto dto);
    List<OrderPromotionResponseDto> getAll();
    Optional<OrderPromotionResponseDto> getById(int id);
    OrderPromotionResponseDto update(int id, OrderPromotionDto dto);
    void delete(int id);
}
