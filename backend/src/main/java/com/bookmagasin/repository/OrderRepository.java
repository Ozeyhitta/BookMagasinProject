package com.bookmagasin.repository;

import com.bookmagasin.entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> {
    // Tìm tất cả orders của một user - eager load user để tránh lazy loading
    // Note: Chỉ fetch một collection (books) để tránh MultipleBagFetchException
    // orderStatusHistories sẽ được lazy load khi cần
    @EntityGraph(attributePaths = {"user", "service", "payment", "books", "books.book"})
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.orderDate DESC")
    List<Order> findByUserIdOrderByOrderDateDesc(@Param("userId") int userId);
}
