package com.bookmagasin.web.controller;

import com.bookmagasin.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class PasswordController {

    private final PasswordResetService passwordResetService; // <-- Interface

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        passwordResetService.createResetToken(request.get("email"));
        return ResponseEntity.ok("✅ Email đặt lại mật khẩu đã được gửi!");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        passwordResetService.resetPassword(request.get("token"), request.get("newPassword"));
        return ResponseEntity.ok("✅ Mật khẩu đã được thay đổi thành công!");
    }
}

