package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Promotion;
import com.bookmagasin.repository.PromotionRepository;
import com.bookmagasin.service.PromotionService;
import com.bookmagasin.web.dto.PromotionDto;
import com.bookmagasin.web.dtoResponse.PromotionResponseDto;
import com.bookmagasin.web.mapper.PromotionMapper;
import org.springframework.stereotype.Service;

import java.util.*;
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
        promotion.setCode(dto.getCode());
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

    @Override
    public PromotionResponseDto applyPromotion(String code, double totalAmount) {
        Promotion promo=promotionRepository.findByCode(code)
                .orElseThrow(()-> new RuntimeException("Mã giảm giá không tồn tại"));

        Date now=new Date();
        if(promo.getStartDate().after(now)||promo.getEndDate().before(now)){
            throw new RuntimeException("Mã giảm giá đã hết hạn hoặc chưa bắt đầu");

        }
        double discount=totalAmount*(promo.getDiscountPercent()/100);
        if(promo.getMaxDiscount()!=null && discount>promo.getMaxDiscount()){
            discount=Math.min(discount,promo.getMaxDiscount());
        }
        double finalAmount=Math.max(0,totalAmount-discount);

        PromotionResponseDto response=new PromotionResponseDto();
        response.setId(promo.getId());
        response.setName(promo.getName());
        response.setCode(promo.getCode());
        response.setMaxDiscount(promo.getMaxDiscount());
        response.setDiscountPercent(promo.getDiscountPercent());
        response.setStartDate(promo.getStartDate());
        response.setEndDate(promo.getEndDate());
        response.setDiscountAmount(discount);
        response.setFinalAmount(finalAmount);

        return response;
    }
}
