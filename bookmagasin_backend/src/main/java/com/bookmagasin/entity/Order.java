package com.bookmagasin.entity;

import com.bookmagasin.enums.EStatusBooking;
import jakarta.persistence.*;
import lombok.CustomLog;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(name="orders")
@NoArgsConstructor
@Data
@Inheritance(strategy = InheritanceType.JOINED) //class cha ke thua
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id") // tên cột foreign key trong bảng order
    private User user;

    private String note;
    private EStatusBooking status;
    private Date orderDate;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="service_id")
    private Service service;


    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_id")
    private Payment payment;
    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL)
    private List<OrderItem> books;


    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL)
    private List<OrderPromotion> orderPromotions;

    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL)
    private List<OrderStatusHistory> orderStatusHistories;

}

