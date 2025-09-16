package com.bookmagasin.service;

import com.bookmagasin.entity.Book;

import java.util.List;
import java.util.Optional;

public interface BookService {
    List<Book> findAll();
    Optional<Book> findById(Integer id);
    Book save(Book book);
    void deleteById(Integer id);

    Book createBook(Book book);
}
