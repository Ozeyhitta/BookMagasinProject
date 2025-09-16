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

    @Column(name="loyal_point")
    private int loyalPoint;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    private List<Order> orderHistory;

    public RegisteredCustomer(String fullName, Date dateOfBirth, String gender, String phoneNumber, String address, String avatarUrl, Account account, Date registrationDate, int loyalPoint, List<Order> orderHistory) {
        super(fullName, dateOfBirth, gender, phoneNumber, address, avatarUrl, account);
        this.registrationDate = registrationDate;
        this.loyalPoint = loyalPoint;
        this.orderHistory = orderHistory;
    }

}
