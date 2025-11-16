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
    public static ReviewResponseDto toResponseDto(Review review){
        ReviewResponseDto dto=new ReviewResponseDto();
        dto.setId(review.getId());
        dto.setRate(review.getRate());
        dto.setContent(review.getContent());
        dto.setCreateAt(review.getCreateAt());

        if(review.getBook()!=null){
            BookDto bookDto=new BookDto();
            bookDto.setId(review.getBook().getId());
            bookDto.setTitle(review.getBook().getTitle());
            dto.setBook(bookDto);
        }
        if(review.getCreateBy()!=null){
            UserDto userDto=new UserDto();
            userDto.setId(review.getCreateBy().getId());
            userDto.setFullName(review.getCreateBy().getFullName());
            dto.setCreateBy(userDto);
        }
        return dto;
    }
    public static Review toEntity(ReviewDto dto, Book book, User user){
        Review review=new Review();
        review.setRate(dto.getRate());
        review.setContent(dto.getContent());
        review.setBook(book);
        review.setCreateBy(user);
        review.setCreateAt(new Date());
        return review;
    }

}
