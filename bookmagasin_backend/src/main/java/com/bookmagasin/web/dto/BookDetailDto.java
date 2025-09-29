package com.bookmagasin.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookDetailDto {
    private int id;
    private String publisher;
    private String supplier;
    private double length;
    private double width;
    private double height;
    private double weight;
    private int pages;
    private String description;

}
