package com.bookmagasin.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private String title;
    private String message;

    // CUSTOMER / STAFF / ADMIN
    private String type;

    // Tùy chọn: gửi cho danh sách userId cụ thể
    private List<Integer> userIds;
}
