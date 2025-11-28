package com.bookmagasin.web.dto;

import lombok.Data;

@Data
public class SupportRequestDto {
    private String email;
    private String type;
    private String issue;
    private String description;
}
