package com.bookmagasin.web.dtoResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class NotificationResponseDto {
    private int id;
    private String title;
    private String message;
    private Date createAt;

}
