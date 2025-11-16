package com.bookmagasin.repository;

import com.bookmagasin.entity.BookDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookDetailRepository extends JpaRepository<BookDetail,Integer> {
    // 🔵 Read
    Optional<BookDetail> findByPublisher(String publisher);
    boolean existsByPublisher(String publisher);

    List<BookDetail> findBySupplier(String supplier);
}
