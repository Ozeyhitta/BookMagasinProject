package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.PasswordResetToken;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.PasswordResetTokenRepository;
import com.bookmagasin.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final AccountRepository accountRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void createResetToken(String email) {

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email: " + email));

        tokenRepository.deleteByAccount_Id(account.getId());
        tokenRepository.flush();

        String otp = String.format("%06d", new Random().nextInt(999999));

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .otp(otp)
                .account(account)
                .expiryDate(LocalDateTime.now().plusMinutes(5))
                .build();

        tokenRepository.save(resetToken);

        sendResetEmail(email, otp);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {

        PasswordResetToken token = tokenRepository.findByAccountEmail(email)
                .orElse(null);

        if (token == null) return false;
        if (!token.getOtp().equals(otp)) return false;
        if (token.isExpired()) return false;

        // ✅ Xóa token ngay khi OTP đúng
        tokenRepository.delete(token);

        return true;
    }


    private void sendResetEmail(String email, String otp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("Mã OTP khôi phục mật khẩu");
        msg.setText("Mã OTP của bạn là: " + otp
                + "\nMã hết hạn sau 5 phút.");

        mailSender.send(msg);
    }

    @Override
    @Transactional
    public void resetPassword(String email, String newPassword) {

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
    }

}
