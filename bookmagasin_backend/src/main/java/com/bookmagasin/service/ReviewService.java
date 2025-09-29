package com.bookmagasin.service;

import com.bookmagasin.web.dto.ReviewDto;
import com.bookmagasin.web.dtoResponse.ReviewResponseDto;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    ReviewResponseDto createReview(ReviewDto dto);
    List<ReviewResponseDto> getAllReviews();
    Optional<ReviewResponseDto> getReviewById(int id);
    ReviewResponseDto updateReview(int id,ReviewDto dto);
    void deleteReview(int id);

}
