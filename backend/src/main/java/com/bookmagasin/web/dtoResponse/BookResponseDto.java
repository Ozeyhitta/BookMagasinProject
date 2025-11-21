package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.web.dto.BookDetailDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookResponseDto {
    private int id;
    private String title;
    private String code;
    private double sellingPrice;
    private Integer stockQuantity;
    private Date publicationDate;
    private int edition;
    private String author;
    private BookDetailDto bookDetail;
    private List<CategoryResponseDto> categories;
}
