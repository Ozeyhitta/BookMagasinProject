package com.bookmagasin.service;

import com.bookmagasin.entity.BookDetail;

import java.util.List;
import java.util.Optional;

public interface BookDetailService {
    List<BookDetail> findAll();
    Optional<BookDetail> findById(Integer id);
    BookDetail save(BookDetail bookDetail);
    void deleteById(Integer id);
}

