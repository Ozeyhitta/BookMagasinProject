package com.bookmagasin.web.mapper;


import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.Promotion;
import com.bookmagasin.entity.OrderPromotion;
import com.bookmagasin.web.dto.OrderPromotionDto;
import com.bookmagasin.web.dtoResponse.OrderPromotionResponseDto;

public class OrderPromotionMapper {

    public static OrderPromotion toEntity(OrderPromotionDto dto, Order order, Promotion promotion) {
        OrderPromotion op = new OrderPromotion();
        op.setOrder(order);
        op.setPromotion(promotion);
        return op;
    }

    public static OrderPromotionResponseDto toResponseDto(OrderPromotion op) {
        return new OrderPromotionResponseDto(
                op.getId(),
                op.getOrder() != null ? op.getOrder().getId() : 0,
                op.getPromotion() != null ? op.getPromotion().getId() : 0,
                op.getDiscountAmount() != null ? op.getDiscountAmount() : 0.0
        );
    }

}
