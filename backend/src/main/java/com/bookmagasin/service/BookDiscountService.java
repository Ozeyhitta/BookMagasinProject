package com.bookmagasin.service;

import com.bookmagasin.web.dto.BookDiscountDto;
import com.bookmagasin.web.dtoResponse.BookDiscountResponseDto;

import java.util.List;
import java.util.Optional;

public interface BookDiscountService {
    // 🔵 Read
    List<BookDiscountResponseDto> findAll();
    Optional<BookDiscountResponseDto> findById(Integer id);
    List<BookDiscountResponseDto> findByBookId(Integer bookId);
    
    // 🟢 Create
    BookDiscountResponseDto save(BookDiscountDto dto);
    
    // 🔴 Update
    BookDiscountResponseDto update(Integer id, BookDiscountDto dto);
    
    // ⚫ Delete
    void deleteById(Integer id);
}

