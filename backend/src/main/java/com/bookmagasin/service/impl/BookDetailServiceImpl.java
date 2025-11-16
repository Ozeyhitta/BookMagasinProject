package com.bookmagasin.service.impl;

import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.repository.BookDetailRepository;
import com.bookmagasin.service.BookDetailService;
import com.bookmagasin.web.dto.BookDetailDto;
import com.bookmagasin.web.dtoResponse.BookDetailResponseDto;
import com.bookmagasin.web.mapper.BookDetailMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookDetailServiceImpl implements BookDetailService {

    private final BookDetailRepository repository;

    public BookDetailServiceImpl(BookDetailRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<BookDetailResponseDto> findAll() {
        return repository.findAll()
                .stream()
                .map(BookDetailMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<BookDetailResponseDto> findById(Integer id) {
        return repository.findById(id)
                .map(BookDetailMapper::toResponseDto);
    }

    @Override
    public BookDetailResponseDto save(BookDetailDto dto) {
        BookDetail saved=repository.save(BookDetailMapper.toEntity(dto));
        return BookDetailMapper.toResponseDto(saved);
    }

    @Override
    public BookDetailResponseDto update(Integer id, BookDetailDto dto) {
        return repository.findById(id).map(existing -> {
            BookDetail updated=BookDetailMapper.toEntity(dto);
            updated.setId(id);
            BookDetail saved=repository.save(updated);
            return BookDetailMapper.toResponseDto(saved);

        }).orElseThrow(() -> new RuntimeException("Book Detail not found with id:"+id));
    }

    @Override
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
