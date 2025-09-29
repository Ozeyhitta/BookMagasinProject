package com.bookmagasin.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisteredCustomerDto {
    private String fullName;
    private Date dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String address;
    private String avatarUrl;
    private int accountId; // tham chiếu đến Account
    private int loyalPoint;
}
