package com.bookmagasin.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookDto {
    private int id;
    private String title;
    private String code;
    private double sellingPrice;
    private Integer stockQuantity;
    private Date publicationDate;
    private int edition;
    private String author;       // chỉ map id thay vì cả Author entity
    private int bookDetailId; // tương tự cho BookDetail
    private BookDetailDto bookDetail;
    private List<Integer> categoryIds;
    private String imageUrl;

}

