package com.bookmagasin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "registered_customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisteredCustomer extends User {

    @Column(name = "registration_date")
    private Date registrationDate;

    @Column(name = "loyal_point")
    private int loyalPoint;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orderHistory;

    // ❌ XOÁ constructor có tham số — KHÔNG dùng super(...)
    // JPA sẽ tự set field, chỉ cần @NoArgsConstructor
}
