package com.bookmagasin.web.dtoResponse;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisteredCustomerResponseDto {
    private int id;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String gender;
    private Date dateOfBirth;
    private String avatarUrl;
    private int loyalPoint;
    private Date registrationDate;

    // Nếu muốn trả order luôn thì thêm:
    private List<Integer> orderIds;
}

