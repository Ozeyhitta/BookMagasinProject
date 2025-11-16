package com.bookmagasin.service;

import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.web.dto.BookDetailDto;
import com.bookmagasin.web.dtoResponse.BookDetailResponseDto;
import com.bookmagasin.web.dtoResponse.BookResponseDto;

import java.util.List;
import java.util.Optional;

public interface BookDetailService {
    List<BookDetailResponseDto> findAll();
    Optional<BookDetailResponseDto> findById(Integer id);
    BookDetailResponseDto save(BookDetailDto dto);
    BookDetailResponseDto update(Integer id,BookDetailDto dto);

    void deleteById(Integer id);
}

