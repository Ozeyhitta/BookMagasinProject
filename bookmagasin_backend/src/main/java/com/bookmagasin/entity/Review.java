package com.bookmagasin.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Entity
@Table(name = "review")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "rate")
    private int rate;
    @Column(name="content")
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_at")
    private Date createAt;

    @ManyToOne
    @JoinColumn(name = "book_id")
    @JsonManagedReference
    private Book book;

    @ManyToOne
    @JoinColumn(name="user_id")
    @JsonManagedReference
    private User createBy;

    public Review(int rate, String content, Date createAt, Book book, User createBy) {
        this.rate = rate;
        this.content = content;
        this.createAt = createAt;
        this.book = book;
        this.createBy = createBy;
    }

}
