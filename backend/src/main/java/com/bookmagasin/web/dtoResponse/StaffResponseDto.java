package com.bookmagasin.web.dtoResponse;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class StaffResponseDto {
    private Integer id;
    private String position;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private String joinDate;

    private Integer userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String dateOfBirth;
    private String address;
    private String avatarUrl;
    private boolean activated;

}
