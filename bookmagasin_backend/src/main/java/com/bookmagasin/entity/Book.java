package com.bookmagasin.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "books")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "selling_price")
    private double sellingPrice;

    @Temporal(TemporalType.DATE)
    private Date publicationDate;

    @Column(name = "edition")
    private int edition;

    @OneToOne(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    @JoinColumn(name = "book_detail_id")
    @JsonBackReference
    private BookDetail bookDetail;

    @OneToMany(mappedBy = "book",cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;


    @JoinColumn(name = "author_name")
    private String author;

    @OneToMany(mappedBy = "book",cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Cart> carts;

    @ManyToMany
    @JoinTable(
            name = "book_category", // Tên bảng trung gian
            joinColumns = @JoinColumn(name = "book_id"), // Cột khóa ngoại trong bảng trung gian
            inverseJoinColumns = @JoinColumn(name = "category_id") // Cột khóa ngoại của bảng Category
    )

    private List<Category> categories; // Mối quan hệ với Category

    @OneToMany(mappedBy = "book",cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Review> reviews;


}
