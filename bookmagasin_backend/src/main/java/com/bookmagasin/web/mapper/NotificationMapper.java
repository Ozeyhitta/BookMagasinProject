package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Notification;
import com.bookmagasin.repository.NotificationRepository;
import com.bookmagasin.web.dto.NotificationDto;
import com.bookmagasin.web.dtoResponse.NotificationResponseDto;

import java.util.Date;

public class NotificationMapper {
    public static NotificationDto toDto(Notification notification){
        NotificationDto dto=new NotificationDto();
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        return dto;
    }
    public static NotificationResponseDto toResponseDto(Notification notification){
        NotificationResponseDto dto=new NotificationResponseDto();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setCreateAt(notification.getSendDate());
        return dto;
    }
    public  static Notification toEntity(NotificationDto dto){
        Notification notification=new Notification();
        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setSendDate(new Date());
        return notification;
    }
}
