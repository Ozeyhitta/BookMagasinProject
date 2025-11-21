package com.bookmagasin.repository;

import com.bookmagasin.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserNotificationRepository extends JpaRepository<UserNotification,Integer> {
    void deleteById_NotificationId(Integer notificationId);

    List<UserNotification> findByUser_Id(Integer userId);

    Optional<UserNotification> findByUser_IdAndNotification_Id(Integer userId, Integer notificationId);

    long countByUser_IdAndIsReadFalse(Integer userId);
}
