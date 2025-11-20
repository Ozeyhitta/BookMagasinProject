package com.bookmagasin.repository;

import com.bookmagasin.entity.OrderItem;
import com.bookmagasin.enums.EStatusBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrder_Id(Integer orderId);

    long countByOrder_User_IdAndBook_IdAndOrder_Status(Integer userId, Integer bookId, EStatusBooking status);
}