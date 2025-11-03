package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.web.dto.BookDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDetailResponseDto {
    private int id;
    private String publisher;
    private String supplier;
    private double length;
    private double width;
    private double height;
    private double weight;
    private int pages;
    private String description;
    private String imageUrl; // ✅ Thêm URL hình ảnh
    private BookDto book;
}
