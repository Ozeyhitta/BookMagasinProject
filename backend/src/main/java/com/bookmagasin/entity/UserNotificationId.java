package com.bookmagasin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserNotificationId implements Serializable {
    @Column(name = "user_id")
    private int userId;
    @Column(name = "notification_id")
    private int notificationId;

}
