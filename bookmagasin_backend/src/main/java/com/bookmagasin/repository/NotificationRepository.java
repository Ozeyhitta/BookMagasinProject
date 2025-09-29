package com.bookmagasin.repository;

import com.bookmagasin.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,Integer> {

    List<Notification> findByTitleContaining(String keyword);

    List<Notification> findBySendDateBetween(Date start, Date end);
}
