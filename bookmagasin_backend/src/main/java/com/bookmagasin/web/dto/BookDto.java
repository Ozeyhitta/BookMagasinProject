package com.bookmagasin.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookDto {
    private int id;
    private String title;
    private double sellingPrice;
    private Date publicationDate;
    private int edition;
    private int authorId;       // chỉ map id thay vì cả Author entity
    private int bookDetailId; // tương tự cho BookDetail

}
