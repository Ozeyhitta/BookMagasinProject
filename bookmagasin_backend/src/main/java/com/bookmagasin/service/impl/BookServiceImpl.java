package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Book;
import com.bookmagasin.repository.BookRepository;
import com.bookmagasin.service.BookService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    @Override
    public Optional<Book> findById(Integer id) {
        return bookRepository.findById(id);
    }

    @Override
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public void deleteById(Integer id) {
        bookRepository.deleteById(id);
    }

    public Book createBook(Book book) {
        // nếu có bookDetail thì gán 2 chiều
        if (book.getBookDetail() != null) {
            book.getBookDetail().setBook(book);
        }
        return bookRepository.save(book);
    }
}
