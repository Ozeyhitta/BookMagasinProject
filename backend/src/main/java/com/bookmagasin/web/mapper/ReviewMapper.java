package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.Review;
import com.bookmagasin.entity.User;
import com.bookmagasin.web.dto.BookDto;
import com.bookmagasin.web.dto.ReviewDto;
import com.bookmagasin.web.dto.UserDto;
import com.bookmagasin.web.dtoResponse.ReviewResponseDto;

import java.util.Date;

public class ReviewMapper {

    // 🔹 Dùng khi tạo review từ DTO + entity Book, User
    public static Review toEntity(ReviewDto dto, Book book, User user) {
        if (dto == null) return null;

        Review review = new Review();
        review.setRate(dto.getRate());
        review.setContent(dto.getContent());
        review.setCreateAt(new Date());   // thời gian tạo
        review.setBook(book);
        review.setCreateBy(user);

        return review;
    }

    // 🔹 Map từ entity -> ReviewResponseDto để trả về cho FE
    public static ReviewResponseDto toResponseDto(Review review) {
        if (review == null) return null;

        // Map Book -> BookDto (chỉ cần id + title là đủ)
        BookDto bookDto = null;
        if (review.getBook() != null) {
            bookDto = new BookDto();
            bookDto.setId(review.getBook().getId());
            bookDto.setTitle(review.getBook().getTitle());
        }

        // Map User -> UserDto (id + fullName)
        UserDto userDto = null;
        if (review.getCreateBy() != null) {
            userDto = new UserDto();
            userDto.setId(review.getCreateBy().getId());
            userDto.setFullName(review.getCreateBy().getFullName());
        }

        ReviewResponseDto dto = new ReviewResponseDto();
        dto.setId(review.getId());
        dto.setRate(review.getRate());
        dto.setContent(review.getContent());
        dto.setCreateAt(review.getCreateAt());
        dto.setBook(bookDto);
        dto.setCreateBy(userDto);

        return dto;
    }
}
