package com.bookmagasin.web.controller;

import com.bookmagasin.service.ReviewService;
import com.bookmagasin.web.dto.ReviewDto;
import com.bookmagasin.web.dtoResponse.ReviewResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewService reviewService;

    // Tạo mới review
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewDto dto) {
        try {
            ReviewResponseDto created = reviewService.createReview(dto);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
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

    // 🔹 Lấy tất cả review của 1 book
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByBook(@PathVariable int bookId) {
        List<ReviewResponseDto> reviews = reviewService.getReviewsByBookId(bookId);
        return ResponseEntity.ok(reviews);
    }

    // 🔹 Lấy các review mới nhất (cho staff xem phần View review)
    @GetMapping("/latest")
    public ResponseEntity<List<ReviewResponseDto>> getLatestReviews() {
        List<ReviewResponseDto> reviews = reviewService.getLatestReviews();
        return ResponseEntity.ok(reviews);
    }

    // Cập nhật review
    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponseDto> updateReview(@PathVariable int id,
                                                          @RequestBody ReviewDto dto) {
        try {
            ReviewResponseDto updated = reviewService.updateReview(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
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
