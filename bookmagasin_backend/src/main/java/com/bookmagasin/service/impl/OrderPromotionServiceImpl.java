package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.OrderPromotion;
import com.bookmagasin.entity.Promotion;
import com.bookmagasin.repository.OrderPromotionRepository;
import com.bookmagasin.repository.OrderRepository;
import com.bookmagasin.repository.PromotionRepository;
import com.bookmagasin.service.OrderPromotionService;
import com.bookmagasin.web.dto.OrderPromotionDto;
import com.bookmagasin.web.dtoResponse.OrderPromotionResponseDto;
import com.bookmagasin.web.mapper.OrderMapper;
import com.bookmagasin.web.mapper.OrderPromotionMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderPromotionServiceImpl implements OrderPromotionService {
    private final OrderPromotionRepository orderPromotionRepository;
    private final OrderRepository orderRepository;
    private final PromotionRepository promotionRepository;

    public OrderPromotionServiceImpl(OrderPromotionRepository orderPromotionRepository, OrderRepository orderRepository, PromotionRepository promotionRepository) {
        this.orderPromotionRepository = orderPromotionRepository;
        this.orderRepository = orderRepository;
        this.promotionRepository = promotionRepository;
    }

    @Override
    public OrderPromotionResponseDto create(OrderPromotionDto dto) {
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Promotion promotion = promotionRepository.findById(dto.getPromotionId())
                .orElseThrow(() -> new RuntimeException("Promotion not found"));

        // Tính giảm giá từ payment.amount
        double originalAmount = order.getPayment().getAmount();
        double discount = originalAmount * promotion.getDiscountPercent() / 100;

        // Cập nhật amount trong Payment
        order.getPayment().setAmount(originalAmount - discount);
        orderRepository.save(order);

        // Tạo OrderPromotion
        OrderPromotion op = new OrderPromotion();
        op.setOrder(order);
        op.setPromotion(promotion);
        op.setDiscountAmount(discount);

        OrderPromotion saved = orderPromotionRepository.save(op);
        return OrderPromotionMapper.toResponseDto(saved);
    }



    @Override
    public List<OrderPromotionResponseDto> getAll() {
        return orderPromotionRepository.findAll()
                .stream()
                .map(OrderPromotionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<OrderPromotionResponseDto> getById(int id) {
        return orderPromotionRepository.findById(id)
                .map(OrderPromotionMapper::toResponseDto);
    }

    @Override
    public OrderPromotionResponseDto update(int id, OrderPromotionDto dto) {
        OrderPromotion existing = orderPromotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderPromotion not found"));

        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Promotion promotion = promotionRepository.findById(dto.getPromotionId())
                .orElseThrow(() -> new RuntimeException("Promotion not found"));

        existing.setOrder(order);
        existing.setPromotion(promotion);

        return OrderPromotionMapper.toResponseDto(orderPromotionRepository.save(existing));
    }

    @Override
    public void delete(int id) {
        OrderPromotion existing = orderPromotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderPromotion not found"));
        orderPromotionRepository.delete(existing);
    }
}
