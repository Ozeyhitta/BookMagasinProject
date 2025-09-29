package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.web.dto.BookDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthorResponseDto {
    private int id;
    private String name;
    private String bio;
    private List<BookDto> books;
}
