package com.bookmagasin.entity;

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

    private int rate;
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_at")
    private Date createAt;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User createBy;

    public Review(int rate, String content, Date createAt, Book book, User createBy) {
        this.rate = rate;
        this.content = content;
        this.createAt = createAt;
        this.book = book;
        this.createBy = createBy;
    }
}
