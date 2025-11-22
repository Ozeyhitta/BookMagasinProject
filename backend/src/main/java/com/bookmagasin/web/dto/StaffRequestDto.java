package com.bookmagasin.web.dto;

import lombok.Data;

@Data
public class StaffRequestDto {
    private String fullName;
    private String email;
    private String phoneNumber;

    private String dateOfBirth;  // dùng String

    private String address;
    private String avatarUrl;
    private String position;
}
