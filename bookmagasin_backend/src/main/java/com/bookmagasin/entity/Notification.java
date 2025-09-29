package com.bookmagasin.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Table(name = "notification")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "message")
    private String message;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "send_date")
    private Date sendDate;

    @OneToMany(mappedBy = "notification",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference(value = "notification-user-notification") // Quản lý mối quan hệ 1 - nhiều
    private List<UserNotification> userNotifications;



}
