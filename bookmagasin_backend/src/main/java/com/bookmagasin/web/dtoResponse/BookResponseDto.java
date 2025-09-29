package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.web.dto.AuthorDto;
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
    private double sellingPrice;
    private Date publicationDate;
    private int edition;
    private AuthorDto author;
    private BookDetailDto bookDetail;
    private List<CategoryResponseDto> categories;
}
