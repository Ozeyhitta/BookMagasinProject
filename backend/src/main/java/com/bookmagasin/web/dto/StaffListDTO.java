package com.bookmagasin.dto;

import lombok.Data;

@Data
public class StaffListDTO {
    private Integer id;          // id account
    private String email;
    private boolean activated;

    private String fullName;
    private String phoneNumber;

    private String position;
    private String joinDate;     // dạng "yyyy-MM-dd" cho dễ render
}
