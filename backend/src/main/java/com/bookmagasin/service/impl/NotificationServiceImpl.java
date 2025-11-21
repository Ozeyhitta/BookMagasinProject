package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Notification;
import com.bookmagasin.entity.User;
import com.bookmagasin.entity.UserNotification;
import com.bookmagasin.entity.UserNotificationId;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.repository.NotificationRepository;
import com.bookmagasin.repository.UserNotificationRepository;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.service.NotificationService;
import com.bookmagasin.web.dto.NotificationDto;
import com.bookmagasin.web.dtoResponse.NotificationResponseDto;
import com.bookmagasin.web.mapper.NotificationMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final UserNotificationRepository userNotificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   UserRepository userRepository,
                                   UserNotificationRepository userNotificationRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.userNotificationRepository = userNotificationRepository;
    }

    @Override
    public NotificationResponseDto createNotification(NotificationDto dto) {
        Notification notification = new Notification();
        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setType(dto.getType());
        notification.setSendDate(new Date());

        Notification saved = notificationRepository.save(notification);

        String type = dto.getType() != null ? dto.getType().toUpperCase() : "";
        List<Integer> targetIds = dto.getUserIds();

        List<User> users = userRepository.findAll();
        Set<Integer> targetSet = new HashSet<>();
        if (targetIds != null) {
            targetSet.addAll(targetIds);
        }

        List<User> targetUsers = users.stream()
                .filter(u -> u.getAccount() != null)
                .filter(u -> {
                    if ("STAFF".equals(type) || "ADMIN".equals(type)) {
                        return u.getAccount().hasRole(ERole.STAFF);
                    }
                    return true;
                })
                .filter(u -> {
                    if (!targetSet.isEmpty()) {
                        Integer userId = u.getId();
                        Integer accountId = u.getAccount() != null ? u.getAccount().getId() : null;
                        return targetSet.contains(userId) || (accountId != null && targetSet.contains(accountId));
                    }
                    return true;
                })
                .collect(Collectors.toList());

        if (targetUsers.isEmpty()) {
            throw new RuntimeException("Không tìm thấy người nhận thông báo");
        }

        for (User user : targetUsers) {
            UserNotification userNotification = new UserNotification();
            userNotification.setId(new UserNotificationId(user.getId(), saved.getId()));
            userNotification.setUser(user);
            userNotification.setNotification(saved);
            userNotification.setRead(false);
            userNotification.setReadAt(null);

            userNotificationRepository.save(userNotification);
        }

        return NotificationMapper.toResponseDto(saved);
    }

    @Override
    public List<NotificationResponseDto> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .map(NotificationMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<NotificationResponseDto> getNotificationById(Integer id) {
        return notificationRepository.findById(id)
                .map(NotificationMapper::toResponseDto);
    }

    @Override
    public NotificationResponseDto updateNotification(Integer id, NotificationDto dto) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + id));

        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setType(dto.getType());

        Notification updated = notificationRepository.save(notification);
        return NotificationMapper.toResponseDto(updated);
    }

    @Transactional
    @Override
    public void deleteNotificationById(Integer id) {
        userNotificationRepository.deleteById_NotificationId(id);
        notificationRepository.deleteById(id);
    }

    @Override
    public List<NotificationResponseDto> getNotificationsByUser(Integer userId) {
        return userNotificationRepository.findByUser_Id(userId)
                .stream()
                .map(un -> {
                    NotificationResponseDto dto = NotificationMapper.toResponseDto(un.getNotification());
                    dto.setRead(un.isRead());
                    dto.setReadAt(un.getReadAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Integer userId, Integer notificationId) {
        UserNotification userNotification = userNotificationRepository
                .findByUser_IdAndNotification_Id(userId, notificationId)
                .orElseThrow(() -> new RuntimeException("UserNotification not found"));

        userNotification.setRead(true);
        userNotification.setReadAt(new Date());

        userNotificationRepository.save(userNotification);
    }

    @Override
    public long countUnreadByUser(Integer userId) {
        return userNotificationRepository.countByUser_IdAndIsReadFalse(userId);
    }
}
