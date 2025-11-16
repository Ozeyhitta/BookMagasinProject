package com.bookmagasin.web.controller;

import com.bookmagasin.service.NotificationService;
import com.bookmagasin.web.dto.NotificationDto;
import com.bookmagasin.web.dtoResponse.NotificationResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<NotificationResponseDto> updateNotification(
            @PathVariable Integer id,
            @RequestBody NotificationDto dto
    ) {
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

    // GET BY USER
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponseDto>> getNotificationsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(service.getNotificationsByUser(userId));
    }

    // MARK READ
    @PostMapping("/mark-read/{notificationId}/user/{userId}")
    public ResponseEntity<Void> markNotificationAsRead(
            @PathVariable Integer notificationId,
            @PathVariable Integer userId
    ) {
        try {
            service.markAsRead(userId, notificationId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ⭐⭐ API STAFF VIEW — DÙNG CHO TRANG FE CỦA BẠN ⭐⭐
    @GetMapping("/staff-view")
    public ResponseEntity<Object> getStaffViewNotifications() {

        List<NotificationResponseDto> all = service.getAllNotifications();

        List<String> customer = all.stream()
                .filter(n -> "CUSTOMER".equalsIgnoreCase(n.getType()))
                .map(NotificationResponseDto::getMessage)
                .toList();

        List<String> staff = all.stream()
                .filter(n -> "STAFF".equalsIgnoreCase(n.getType()))
                .map(NotificationResponseDto::getMessage)
                .toList();

        List<String> admin = all.stream()
                .filter(n -> "ADMIN".equalsIgnoreCase(n.getType()))
                .map(NotificationResponseDto::getMessage)
                .toList();

        return ResponseEntity.ok(
                new java.util.HashMap<>() {{
                    put("customer", customer);
                    put("staff", staff);
                    put("admin", admin);
                }}
        );
    }
}
