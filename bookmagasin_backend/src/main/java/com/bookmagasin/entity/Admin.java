package com.bookmagasin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "admin")
@Data
@NoArgsConstructor
public class Admin extends User{
    @Column(name = "position")
    private String position;

    public Admin(String fullName, Date dateOfBirth, String gender, String phoneNumber, String address, String avatarUrl, Account account, String position) {
        super(fullName, dateOfBirth, gender, phoneNumber, address, avatarUrl, account);
        this.position = position;
    }
}
