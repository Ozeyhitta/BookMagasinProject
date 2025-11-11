package com.bookmagasin.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "book_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "publisher")
    private String publisher; // NXB
    @Column(name = "supplier")
    private String supplier; // Nhà cung cấp
    @Column(name = "length")
    private double length; //dai
    @Column(name = "width")
    private double width; //rong
    @Column(name = "height")
    private double height; //cao
    @Column(name = "weight")
    private double weight; // nang
    @Column(name = "pages")
    private int pages; //so trang

    @Column(name = "description")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToOne(mappedBy = "bookDetail")
    @JsonBackReference
    private Book book;
}
