package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.Review;
import com.bookmagasin.entity.User;
import com.bookmagasin.repository.BookRepository;
import com.bookmagasin.repository.ReviewRepository;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.service.ReviewService;
import com.bookmagasin.web.dto.ReviewDto;
import com.bookmagasin.web.dtoResponse.ReviewResponseDto;
import com.bookmagasin.web.mapper.ReviewMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {


    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ReviewResponseDto createReview(ReviewDto dto) {
        Book book =bookRepository.findById(dto.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        User user =userRepository.findById(dto.getCreateById())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Review review= ReviewMapper.toEntity(dto,book,user);
        Review saved=reviewRepository.save(review);
        return ReviewMapper.toResponseDto(saved);
    }

    @Override
    public List<ReviewResponseDto> getAllReviews() {
        return reviewRepository.findAll()
                .stream()
                .map(ReviewMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ReviewResponseDto> getReviewById(int id) {
        return reviewRepository.findById(id)
                .map(ReviewMapper::toResponseDto);
    }

    @Override
    public ReviewResponseDto updateReview(int id, ReviewDto dto) {
        Review review=reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        Book book = bookRepository.findById(dto.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        User user = userRepository.findById(dto.getCreateById())
                .orElseThrow(() -> new RuntimeException("User not found"));
        review.setRate(dto.getRate());
        review.setContent(dto.getContent());
        review.setBook(book);
        review.setCreateBy(user);

        Review updated=reviewRepository.save(review);
        return ReviewMapper.toResponseDto(updated);
    }

    @Override
    public void deleteReview(int id) {
        reviewRepository.deleteById(id);
    }
}
