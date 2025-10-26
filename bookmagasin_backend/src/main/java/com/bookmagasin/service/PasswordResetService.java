package com.bookmagasin.service;

public interface PasswordResetService {

    /**
     * Gửi email chứa token đặt lại mật khẩu cho người dùng
     * @param email Email người dùng cần khôi phục
     */
    void createResetToken(String email);

    /**
     * Đặt lại mật khẩu bằng token hợp lệ
     * @param token Mã token đặt lại mật khẩu
     * @param newPassword Mật khẩu mới
     */
    void resetPassword(String token, String newPassword);
}
