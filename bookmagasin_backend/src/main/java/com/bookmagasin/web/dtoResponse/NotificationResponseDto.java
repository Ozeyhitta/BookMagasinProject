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

    // Ngày gửi (map từ sendDate)
    private Date createAt;

    // CUSTOMER / STAFF / ADMIN
    private String type;
}
