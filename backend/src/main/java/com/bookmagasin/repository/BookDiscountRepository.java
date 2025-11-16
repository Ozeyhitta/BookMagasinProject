package com.bookmagasin.repository;

import com.bookmagasin.entity.BookDiscount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookDiscountRepository extends JpaRepository<BookDiscount, Integer> {
    // 🔵 Tìm discount theo book_id
    List<BookDiscount> findByBookId(Integer bookId);
    
    // 🔵 Tìm discount đang active (trong khoảng thời gian)
    List<BookDiscount> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(Date currentDate, Date currentDate2);
    
    // 🔵 Kiểm tra discount có tồn tại cho book không
    boolean existsByBookId(Integer bookId);
    
    // 🔵 Tìm discount active cho một book cụ thể
    Optional<BookDiscount> findByBookIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Integer bookId, Date startDate, Date endDate);
}

