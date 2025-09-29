package com.bookmagasin.web.dto;

import com.bookmagasin.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthorDto {
    private int id;
    private String name;
    private String bio;
}
