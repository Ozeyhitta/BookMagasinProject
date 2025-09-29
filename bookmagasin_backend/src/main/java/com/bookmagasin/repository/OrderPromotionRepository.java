package com.bookmagasin.repository;

import com.bookmagasin.entity.OrderPromotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderPromotionRepository extends JpaRepository<OrderPromotion,Integer> {
}
