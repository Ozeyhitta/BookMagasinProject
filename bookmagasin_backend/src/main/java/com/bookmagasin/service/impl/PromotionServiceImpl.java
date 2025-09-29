package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Promotion;
import com.bookmagasin.repository.PromotionRepository;
import com.bookmagasin.service.PromotionService;
import com.bookmagasin.web.dto.PromotionDto;
import com.bookmagasin.web.dtoResponse.PromotionResponseDto;
import com.bookmagasin.web.mapper.PromotionMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;

    public PromotionServiceImpl(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }


    @Override
    public PromotionResponseDto create(PromotionDto dto) {
        Promotion promotion = PromotionMapper.toEntity(dto);
        Promotion saved = promotionRepository.save(promotion);
        return PromotionMapper.toResponseDto(saved);
    }

    @Override
    public List<PromotionResponseDto> getAll() {
        return promotionRepository.findAll()
                .stream()
                .map(PromotionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PromotionResponseDto> getById(int id) {
        return promotionRepository.findById(id)
                .map(PromotionMapper::toResponseDto);
    }

    @Override
    public PromotionResponseDto update(int id, PromotionDto dto) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));

        promotion.setName(dto.getName());
        promotion.setDiscountPercent(dto.getDiscountPercent());
        promotion.setStartDate(dto.getStartDate());
        promotion.setEndDate(dto.getEndDate());

        return PromotionMapper.toResponseDto(promotionRepository.save(promotion));
    }

    @Override
    public void delete(int id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        promotionRepository.delete(promotion);
    }
}
