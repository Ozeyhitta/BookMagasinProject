package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.Staff;
import com.bookmagasin.entity.User;
import com.bookmagasin.web.dto.StaffRequestDto;
import com.bookmagasin.web.dtoResponse.StaffResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class StaffMapper {

    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    private Date parseDate(String s) {
        try {
            return (s == null || s.isEmpty()) ? null : sdf.parse(s);
        } catch (Exception e) {
            return null;
        }
    }

    private String formatDate(Date d) {
        return d == null ? null : sdf.format(d);
    }

    /**
     * Dùng khi ADMIN tạo nhân viên mới
     */
    public User toUserEntity(StaffRequestDto dto) {
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setDateOfBirth(parseDate(dto.getDateOfBirth()));
        user.setAddress(dto.getAddress());
        user.setAvatarUrl(dto.getAvatarUrl());
        return user;
    }

    /**
     * Dùng khi cập nhật nhân viên
     */
    public void updateUserEntity(User user, StaffRequestDto dto) {
        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setDateOfBirth(parseDate(dto.getDateOfBirth()));
        user.setAddress(dto.getAddress());
        user.setAvatarUrl(dto.getAvatarUrl());
    }

    /**
     * Tạo response trả về FE
     */
    public StaffResponseDto toResponseDto(Account acc, Staff staff) {

        StaffResponseDto dto = new StaffResponseDto();

        dto.setId(acc.getId());
        dto.setEmail(acc.getEmail());
        dto.setActivated(acc.isActivated());

        User user = acc.getUser();
        if (user != null) {
            dto.setFullName(user.getFullName());
            dto.setPhoneNumber(user.getPhoneNumber());
            dto.setDateOfBirth(formatDate(user.getDateOfBirth()));
            dto.setAddress(user.getAddress());
            dto.setAvatarUrl(user.getAvatarUrl());
        }

        if (staff != null) {
            dto.setPosition(staff.getPosition());
            dto.setJoinDate(formatDate(staff.getApprovedDate()));
        }

        return dto;
    }
}

