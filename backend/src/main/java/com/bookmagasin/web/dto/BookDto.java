package com.bookmagasin.web.dto;

import com.bookmagasin.entity.Category;
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
    private double sellingPrice;
    private Date publicationDate;
    private int edition;
    private String author;       // chỉ map id thay vì cả Author entity
    private int bookDetailId; // tương tự cho BookDetail
    private List<Integer> categoryIds;
    private String imageUrl;

}

