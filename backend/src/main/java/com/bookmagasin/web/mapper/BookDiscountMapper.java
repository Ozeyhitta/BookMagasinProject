package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.BookDiscount;
import com.bookmagasin.web.dto.BookDto;
import com.bookmagasin.web.dto.BookDiscountDto;
import com.bookmagasin.web.dtoResponse.BookDiscountResponseDto;

public class BookDiscountMapper {

    // Dùng để hiển thị ra ngoài (Response) - có thông tin đầy đủ Book
    public static BookDiscountResponseDto toResponseDto(BookDiscount discount) {
        BookDiscountResponseDto dto = new BookDiscountResponseDto();
        dto.setId(discount.getId());
        dto.setDiscountPercent(discount.getDiscountPercent());
        dto.setDiscountAmount(discount.getDiscountAmount());
        dto.setStartDate(discount.getStartDate());
        dto.setEndDate(discount.getEndDate());
        
        // Map Book information
        if (discount.getBook() != null) {
            BookDto bookDto = new BookDto();
            bookDto.setId(discount.getBook().getId());
            bookDto.setTitle(discount.getBook().getTitle());
            bookDto.setSellingPrice(discount.getBook().getSellingPrice());
            bookDto.setAuthor(discount.getBook().getAuthor());
            dto.setBook(bookDto);
        }
        
        return dto;
    }

    // Dùng để lưu vào DB (chỉ cần bookId)
    public static BookDiscount toEntity(BookDiscountDto dto) {
        BookDiscount discount = new BookDiscount();
        discount.setDiscountPercent(dto.getDiscountPercent());
        discount.setDiscountAmount(dto.getDiscountAmount());
        discount.setStartDate(dto.getStartDate());
        discount.setEndDate(dto.getEndDate());
        // Book sẽ được set trong Service
        return discount;
    }

    // Cập nhật entity đã tồn tại
    public static void updateEntity(BookDiscount discount, BookDiscountDto dto) {
        if (dto.getDiscountPercent() != null) {
            discount.setDiscountPercent(dto.getDiscountPercent());
        }
        if (dto.getDiscountAmount() != null) {
            discount.setDiscountAmount(dto.getDiscountAmount());
        }
        if (dto.getStartDate() != null) {
            discount.setStartDate(dto.getStartDate());
        }
        if (dto.getEndDate() != null) {
            discount.setEndDate(dto.getEndDate());
        }
    }
}

