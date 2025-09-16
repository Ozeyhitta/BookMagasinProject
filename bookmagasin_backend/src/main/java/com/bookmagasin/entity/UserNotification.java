package com.bookmagasin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name="user_notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserNotification {

    @EmbeddedId
    private UserNotificationId id = new UserNotificationId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("notificationId")
    @JoinColumn(name = "notification_id")
    private Notification notification;

    @Column(name = "is_read")
    private boolean isRead;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "read_at")
    private Date readAt;

}
