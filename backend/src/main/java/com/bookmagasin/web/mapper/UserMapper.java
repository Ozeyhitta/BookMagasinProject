package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.User;
import com.bookmagasin.web.dto.UserDto;
import com.bookmagasin.web.dtoResponse.UserResponseDto;

public class UserMapper {

    public static UserResponseDto toDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setGender(user.getGender());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setAvatarUrl(user.getAvatarUrl());

        if (user.getAccount() != null) {
            dto.setEmail(user.getAccount().getEmail());
        }

        return dto;
    }



    public static UserResponseDto toResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setGender(user.getGender() != null ? user.getGender() : "");
        dto.setPhoneNumber(user.getPhoneNumber() != null ? user.getPhoneNumber() : "");
        dto.setAddress(user.getAddress() != null ? user.getAddress() : "");
        dto.setAvatarUrl(user.getAvatarUrl() != null ? user.getAvatarUrl() : "");

        if (user.getAccount() != null) {
            dto.setEmail(user.getAccount().getEmail());
        } else {
            dto.setEmail("");
        }

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
    public static void updateEntity(User user, UserDto dto) {
        user.setFullName(dto.getFullName());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setGender(dto.getGender());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAddress(dto.getAddress());
        user.setAvatarUrl(dto.getAvatarUrl());
    }

}


