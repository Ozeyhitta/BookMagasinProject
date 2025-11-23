package com.bookmagasin.repository;

import com.bookmagasin.entity.OrderItem;
import com.bookmagasin.enums.EStatusBooking;
import com.bookmagasin.repository.projection.BookSalesProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrder_Id(Integer orderId);

    long countByOrder_User_IdAndBook_IdAndOrder_Status(Integer userId, Integer bookId, EStatusBooking status);

    @Query("SELECT oi.book.id AS bookId, SUM(oi.quantity) AS totalSold " +
            "FROM OrderItem oi " +
            "WHERE (:status IS NULL OR oi.order.status = :status) " +
            "GROUP BY oi.book.id")
    List<BookSalesProjection> aggregateTotalSoldByStatus(@Param("status") EStatusBooking status);

    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi " +
            "WHERE oi.book.id = :bookId AND (:status IS NULL OR oi.order.status = :status)")
    Long sumQuantityByBookIdAndStatus(@Param("bookId") Integer bookId,
                                      @Param("status") EStatusBooking status);
}
