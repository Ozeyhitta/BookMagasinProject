package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.entity.BookDiscount;
import com.bookmagasin.web.dto.BookDetailDto;
import com.bookmagasin.web.dto.BookDto;
import com.bookmagasin.web.dtoResponse.BookDetailResponseDto;
import com.bookmagasin.web.dtoResponse.BookDiscountResponseDto;
import com.bookmagasin.web.mapper.BookDiscountMapper;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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

        if (detail.getBook() != null) {
            Book book = detail.getBook();
            BookDto bookDto = new BookDto();
            bookDto.setId(book.getId());
            bookDto.setTitle(book.getTitle());
            dto.setBook(bookDto);

            if (book.getBookDiscounts() != null && !book.getBookDiscounts().isEmpty()) {
                List<BookDiscountResponseDto> history = book.getBookDiscounts().stream()
                        .map(BookDiscountMapper::toResponseDto)
                        .collect(Collectors.toList());
                dto.setDiscountHistory(history);

                BookDiscountResponseDto active = history.stream()
                        .filter(d -> isActive(d.getStartDate(), d.getEndDate()))
                        .max(Comparator.comparing(BookDiscountResponseDto::getStartDate,
                                Comparator.nullsFirst(Comparator.naturalOrder())))
                        .orElse(history.get(0));
                dto.setDiscount(active);
            }
        }
        return dto;
    }

    private static boolean isActive(Date start, Date end) {
        Date now = new Date();
        boolean afterStart = start == null || !now.before(start);
        boolean beforeEnd = end == null || !now.after(end);
        return afterStart && beforeEnd;
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
