package com.bookmagasin.repository;

import com.bookmagasin.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRepository extends JpaRepository<Promotion,Integer> {
}
