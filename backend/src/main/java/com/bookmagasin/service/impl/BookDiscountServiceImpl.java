package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.BookDiscount;
import com.bookmagasin.repository.BookDiscountRepository;
import com.bookmagasin.repository.BookRepository;
import com.bookmagasin.service.BookDiscountService;
import com.bookmagasin.web.dto.BookDiscountDto;
import com.bookmagasin.web.dtoResponse.BookDiscountResponseDto;
import com.bookmagasin.web.mapper.BookDiscountMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookDiscountServiceImpl implements BookDiscountService {

    private final BookDiscountRepository discountRepository;
    private final BookRepository bookRepository;

    public BookDiscountServiceImpl(BookDiscountRepository discountRepository, BookRepository bookRepository) {
        this.discountRepository = discountRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public List<BookDiscountResponseDto> findAll() {
        return discountRepository.findAll()
                .stream()
                .map(BookDiscountMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<BookDiscountResponseDto> findById(Integer id) {
        return discountRepository.findById(id)
                .map(BookDiscountMapper::toResponseDto);
    }

    @Override
    public List<BookDiscountResponseDto> findByBookId(Integer bookId) {
        return discountRepository.findByBookId(bookId)
                .stream()
                .map(BookDiscountMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public BookDiscountResponseDto save(BookDiscountDto dto) {
        BookDiscount discount = BookDiscountMapper.toEntity(dto);
        
        // Set Book nếu có bookId
        if (dto.getBookId() != null) {
            Book book = bookRepository.findById(dto.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found with id: " + dto.getBookId()));
            discount.setBook(book);
        }
        
        BookDiscount saved = discountRepository.save(discount);
        return BookDiscountMapper.toResponseDto(saved);
    }

    @Override
    public BookDiscountResponseDto update(Integer id, BookDiscountDto dto) {
        return discountRepository.findById(id).map(existing -> {
            // Update các trường
            BookDiscountMapper.updateEntity(existing, dto);
            
            // Update Book nếu có bookId mới
            if (dto.getBookId() != null) {
                Book book = bookRepository.findById(dto.getBookId())
                        .orElseThrow(() -> new RuntimeException("Book not found with id: " + dto.getBookId()));
                existing.setBook(book);
            }
            
            BookDiscount saved = discountRepository.save(existing);
            return BookDiscountMapper.toResponseDto(saved);
            
        }).orElseThrow(() -> new RuntimeException("Book Discount not found with id: " + id));
    }

    @Override
    public void deleteById(Integer id) {
        if (!discountRepository.existsById(id)) {
            throw new RuntimeException("Book Discount not found with id: " + id);
        }
        discountRepository.deleteById(id);
    }
}

