package com.bookmagasin;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGen {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String raw = "admin123"; // mật khẩu bạn muốn
        String encoded = encoder.encode(raw);
        System.out.println(encoded);
    }
}