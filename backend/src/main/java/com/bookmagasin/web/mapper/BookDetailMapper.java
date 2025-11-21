package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.web.dto.BookDetailDto;
import com.bookmagasin.web.dto.BookDto;
import com.bookmagasin.web.dtoResponse.BookDetailResponseDto;

public class BookDetailMapper {

    // Dùng để hiển thị ra ngoài (Response)
    public static BookDetailResponseDto toResponseDto(BookDetail detail) {
        BookDetailResponseDto dto = new BookDetailResponseDto();
        dto.setId(detail.getId());
        dto.setPublisher(detail.getPublisher());
        dto.setSupplier(detail.getSupplier());
        dto.setLength(detail.getLength());
        dto.setWidth(detail.getWidth());
        dto.setHeight(detail.getHeight());
        dto.setWeight(detail.getWeight());
        dto.setPages(detail.getPages());
        dto.setDescription(detail.getDescription());
        dto.setImageUrl(detail.getImageUrl()); // ✅ Thêm dòng này

        if(detail.getBook()!=null){
            BookDto bookDto = new BookDto();
            bookDto.setId(detail.getBook().getId());
            bookDto.setTitle(detail.getBook().getTitle());
            dto.setBook(bookDto);
        }
        return dto;
    }

    // Dùng để lưu vào DB
    public static BookDetail toEntity(BookDetailDto dto) {
        BookDetail detail = new BookDetail();
        detail.setPublisher(dto.getPublisher());
        detail.setSupplier(dto.getSupplier());
        detail.setLength(dto.getLength());
        detail.setWidth(dto.getWidth());
        detail.setHeight(dto.getHeight());
        detail.setWeight(dto.getWeight());
        detail.setPages(dto.getPages());
        detail.setDescription(dto.getDescription());
        detail.setImageUrl(dto.getImageUrl());
        return detail;
    }

    // Cập nhật entity đã tồn tại
    public static void updateEntity(BookDetail detail, BookDetailDto dto) {
        detail.setPublisher(dto.getPublisher());
        detail.setSupplier(dto.getSupplier());
        detail.setLength(dto.getLength());
        detail.setWidth(dto.getWidth());
        detail.setHeight(dto.getHeight());
        detail.setWeight(dto.getWeight());
        detail.setPages(dto.getPages());
        detail.setDescription(dto.getDescription());
        detail.setImageUrl(dto.getImageUrl());
    }
}
