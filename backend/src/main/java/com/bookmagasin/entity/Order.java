package com.bookmagasin.entity;

import com.bookmagasin.enums.EStatusBooking;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.util.Date;
import java.util.List;

@Entity
@Table(name="orders")
@NoArgsConstructor
@Getter
@Setter
@ToString(onlyExplicitlyIncluded = true)
@Inheritance(strategy = InheritanceType.JOINED) //class cha ke thua
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // --- USER (nhiều đơn có thể thuộc 1 user)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String note;

    @Enumerated(EnumType.STRING)
    private EStatusBooking status;

    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate;

    // --- SERVICE (nhiều order có thể dùng 1 service)
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    // --- PAYMENT (nhiều order có thể dùng 1 phương thức thanh toán)
    @ManyToOne
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    // --- ORDER ITEMS (1 order có nhiều sản phẩm)
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> books;

    // --- CÁC QUAN HỆ KHÁC
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderPromotion> orderPromotions;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 20) // Fetch orderStatusHistories trong batch để tránh N+1 queries
    private List<OrderStatusHistory> orderStatusHistories;

    // --- THÔNG TIN GIAO HÀNG
    private String shippingAddress;
    private String phoneNumber;
    private Double totalPrice;
}


