package com.bookmagasin.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;

import lombok.Data;

import lombok.NoArgsConstructor;

import java.util.Date;

@Entity

@Table(name = "book_discounts")

@Data

@AllArgsConstructor

@NoArgsConstructor

public class BookDiscount {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int id;

    // % discount hoặc giá giảm cố định

    @Column(name = "discount_percent")

    private Double discountPercent;

    @Column(name = "discount_amount")

    private Double discountAmount;

    @Temporal(TemporalType.TIMESTAMP)

    @Column(name = "start_date")

    private Date startDate;

    @Temporal(TemporalType.TIMESTAMP)

    @Column(name = "end_date")

    private Date endDate;

    @ManyToOne

    @JoinColumn(name = "book_id")

    @JsonBackReference

    private Book book;

}

