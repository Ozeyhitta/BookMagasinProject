package com.bookmagasin.web.dto;

import lombok.Data;

@Data
public class StaffListDTO {
    private Integer id;
    private String email;
    private Boolean activated;
    private String fullName;
    private String phoneNumber;
    private String position;
    private String joinDate;
}

