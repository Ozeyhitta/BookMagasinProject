package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Notification;
import com.bookmagasin.web.dto.NotificationDto;
import com.bookmagasin.web.dtoResponse.NotificationResponseDto;

public class NotificationMapper {

    public static NotificationResponseDto toResponseDto(Notification n) {
        NotificationResponseDto dto = new NotificationResponseDto();
        dto.setId(n.getId());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setCreateAt(n.getSendDate());  // ✔ map đúng vào createAt
        dto.setType(n.getType());
        return dto;
    }

    public static Notification toEntity(NotificationDto dto) {
        Notification n = new Notification();
        n.setTitle(dto.getTitle());
        n.setMessage(dto.getMessage());
        n.setType(dto.getType());
        // sendDate sẽ set trong service
        return n;
    }

    public static void updateEntity(Notification n, NotificationDto dto) {
        n.setTitle(dto.getTitle());
        n.setMessage(dto.getMessage());
        n.setType(dto.getType());
    }
}
