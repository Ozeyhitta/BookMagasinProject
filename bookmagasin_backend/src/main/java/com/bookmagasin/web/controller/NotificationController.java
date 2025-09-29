package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Notification;
import com.bookmagasin.service.NotificationService;
import com.bookmagasin.web.dto.NotificationDto;
import com.bookmagasin.web.dto.SendNotificationRequest;
import com.bookmagasin.web.dtoResponse.NotificationResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/notifications")
public class NotificationController {
    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<NotificationResponseDto> createNotification(@RequestBody NotificationDto dto) {
        NotificationResponseDto created = service.createNotification(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getAllNotifications() {
        return ResponseEntity.ok(service.getAllNotifications());
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponseDto> getNotificationById(@PathVariable Integer id) {
        return service.getNotificationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<NotificationResponseDto> updateNotification(@PathVariable Integer id, @RequestBody NotificationDto dto) {
        try {
            NotificationResponseDto updated = service.updateNotification(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Integer id) {
        service.deleteNotificationById(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/notifications/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponseDto>> getNotificationsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(service.getNotificationsByUser(userId));
    }

    // POST /api/notifications/mark-read/{notificationId}/user/{userId}
    @PostMapping("/mark-read/{notificationId}/user/{userId}")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Integer notificationId,
                                                       @PathVariable Integer userId) {
        try {
            service.markAsRead(userId, notificationId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
