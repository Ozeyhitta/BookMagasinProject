package com.bookmagasin.service;

public interface PasswordResetService {
    void createResetToken(String email);
    boolean verifyOtp(String email, String otp);
    void resetPassword(String email, String newPassword);
}

