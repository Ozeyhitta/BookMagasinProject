package com.bookmagasin.web.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private int id;
    private String fullName;
    private Date dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String address;
    private String avatarUrl;


}
