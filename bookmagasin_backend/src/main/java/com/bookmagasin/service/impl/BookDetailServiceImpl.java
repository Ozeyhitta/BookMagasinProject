package com.bookmagasin.service.impl;

import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.repository.BookDetailRepository;
import com.bookmagasin.service.BookDetailService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookDetailServiceImpl implements BookDetailService {
    private final BookDetailRepository repository;

    public BookDetailServiceImpl(BookDetailRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<BookDetail> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<BookDetail> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public BookDetail save(BookDetail bookDetail) {
        return (BookDetail) repository.save(bookDetail);
    }

    @Override
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
