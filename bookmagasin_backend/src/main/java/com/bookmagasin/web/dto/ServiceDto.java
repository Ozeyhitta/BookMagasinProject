package com.bookmagasin.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDto {
    private String nameService;
    private Double price;
    private Boolean status;
}


