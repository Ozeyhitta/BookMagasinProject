package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Review;
import com.bookmagasin.repository.ReviewRepository;
import com.bookmagasin.service.ReviewService;
import com.bookmagasin.web.dto.ReviewDto;
import com.bookmagasin.web.dtoResponse.ReviewResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Tạo mới review
    @PostMapping
    public ResponseEntity<ReviewResponseDto> createReview(@RequestBody ReviewDto dto) {
        ReviewResponseDto created=reviewService.createReview(dto);
        return new ResponseEntity<>(created,HttpStatus.CREATED);
    }

    // Lấy tất cả review
    @GetMapping
    public ResponseEntity<List<ReviewResponseDto>> getAllReviews() {
        List<ReviewResponseDto> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    // Lấy review theo id
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDto> getReviewById(@PathVariable int id) {
        return reviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Cập nhật review
    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponseDto> updateReview(@PathVariable int id, @RequestBody ReviewDto dto) {
        try{
            ReviewResponseDto updated=reviewService.updateReview(id,dto);
            return ResponseEntity.ok(updated);
        }catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    // Xóa review
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable int id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
