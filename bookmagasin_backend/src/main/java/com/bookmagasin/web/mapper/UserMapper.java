package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.User;
import com.bookmagasin.web.dto.UserDto;
import com.bookmagasin.web.dtoResponse.UserResponseDto;

public class UserMapper {

    public static UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setFullName(user.getFullName());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setGender(user.getGender());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }

    public static UserResponseDto toResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setGender(user.getGender());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }

    public static User toEntity(UserDto dto) {
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setGender(dto.getGender());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAddress(dto.getAddress());
        user.setAvatarUrl(dto.getAvatarUrl());
        return user;
    }
}


