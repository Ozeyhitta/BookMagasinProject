package com.bookmagasin.repository;

import com.bookmagasin.entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> {
    // Tìm tất cả orders của một user - eager load user để tránh lazy loading
    // Note: Chỉ fetch một collection (books) để tránh MultipleBagFetchException
    // orderStatusHistories sẽ được lazy load khi cần
    @EntityGraph(attributePaths = {"user", "service", "payment", "books", "books.book"})
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.orderDate DESC")
    List<Order> findByUserIdOrderByOrderDateDesc(@Param("userId") int userId);

    @EntityGraph(attributePaths = {"user", "service", "payment"})
    @Query("SELECT o FROM Order o")
    List<Order> findAllLightweight();

    // Chỉ fetch books trong EntityGraph để tránh MultipleBagFetchException
    // orderStatusHistories sẽ được lazy load khi cần (đã có @BatchSize)
    // Fetch thêm bookDetail và bookDiscounts để có imageUrl và discount info
    @EntityGraph(attributePaths = {
            "user",
            "service",
<<<<<<< HEAD
            "payment"
=======
            "payment",
            "books",
            "books.book",
            "books.book.bookDetail",
            "books.book.bookDiscounts"
>>>>>>> 8dcf7faa58b9f62866a8b49037d2aaa993a3854b
    })
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Optional<Order> findByIdWithDetails(@Param("id") Integer id);

    @EntityGraph(attributePaths = {
            "user",
            "books",
            "books.book",
            "books.book.categories"
    })
    @Query("SELECT DISTINCT o FROM Order o WHERE (:start IS NULL OR o.orderDate >= :start) AND (:end IS NULL OR o.orderDate <= :end)")
    List<Order> findWithItemsByDateRange(@Param("start") java.time.LocalDateTime start,
                                         @Param("end") java.time.LocalDateTime end);
}
