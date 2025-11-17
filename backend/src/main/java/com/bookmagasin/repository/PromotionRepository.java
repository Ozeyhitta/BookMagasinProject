package com.bookmagasin.repository;

import com.bookmagasin.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion,Integer> {
    Optional<Promotion> findByCode(String code);
}
