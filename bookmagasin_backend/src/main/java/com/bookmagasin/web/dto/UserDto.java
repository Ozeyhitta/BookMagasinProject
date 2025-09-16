package com.bookmagasin.web.dto;


import lombok.Data;
import java.util.Date;

@Data
public class UserDto {
    private int id;
    private String fullName;
    private Date dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String address;
    private String avatarUrl;

}
