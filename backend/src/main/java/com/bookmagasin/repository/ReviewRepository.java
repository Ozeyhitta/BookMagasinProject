package com.bookmagasin.repository;

import com.bookmagasin.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    // 🔹 Lấy danh sách review theo bookId
    List<Review> findByBook_Id(int bookId);
    List<Review> findTop20ByOrderByCreateAtDesc();

}

