package com.bookmagasin.service;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.web.dto.BookDto;
import com.bookmagasin.web.dtoResponse.BookResponseDto;

import java.util.List;
import java.util.Optional;

public interface BookService {
    List<BookDto> findAll();
    Optional<BookDto> findById(int id);
    BookDto createBook(BookDto dto);
    BookDto updateBook(int id, BookDto dto);
    void deleteById(int id);
    List<BookResponseDto> findAllWithDetails();
    Optional<BookResponseDto> findByIdWithDetails(int id);
    List<BookResponseDto> findTopSellingBooks(int limit);

    Optional<Book> patchBookDetail(Integer id, BookDetail detailUpdates);

    boolean updateBookCategories(int bookId, List<Integer> categoryIds);
}

