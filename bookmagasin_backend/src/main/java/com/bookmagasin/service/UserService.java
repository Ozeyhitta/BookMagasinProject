package com.bookmagasin.service;


import com.bookmagasin.entity.User;
import com.bookmagasin.web.dto.UserDto;
import com.bookmagasin.web.dtoResponse.UserResponseDto;

import java.util.List;
import java.util.Optional;


public interface UserService {
    UserResponseDto createUser(UserDto dto);
    List<UserResponseDto> getAllUsers();
    Optional<UserResponseDto> getUserById(Integer id);
    Optional<UserResponseDto> getUserByPhoneNumber(String phoneNumber);
    UserResponseDto updateUser(Integer id,UserDto dto);
    void deleteUserById(Integer id);
}

