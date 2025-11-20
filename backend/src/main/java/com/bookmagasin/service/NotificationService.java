package com.bookmagasin.service;

import com.bookmagasin.web.dto.NotificationDto;
import com.bookmagasin.web.dtoResponse.NotificationResponseDto;

import java.util.List;
import java.util.Optional;

public interface NotificationService {
    NotificationResponseDto createNotification(NotificationDto dto);
    List<NotificationResponseDto> getAllNotifications();
    Optional<NotificationResponseDto> getNotificationById(Integer id);
    NotificationResponseDto updateNotification(Integer id, NotificationDto dto);
    void deleteNotificationById(Integer id);
    List<NotificationResponseDto> getNotificationsByUser(Integer userId);
    void markAsRead(Integer userId, Integer notificationId);
    long countUnreadByUser(Integer userId);
}
