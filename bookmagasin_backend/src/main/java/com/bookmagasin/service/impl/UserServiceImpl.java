package com.bookmagasin.service.impl;

import com.bookmagasin.entity.User;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.service.UserService;
import com.bookmagasin.web.dto.UserDto;
import com.bookmagasin.web.dtoResponse.UserResponseDto;
import com.bookmagasin.web.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Override
    public UserResponseDto createUser(UserDto dto) {
        User user= UserMapper.toEntity(dto);
        User saved=userRepository.save(user);
        return UserMapper.toResponseDto(saved);

    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<UserResponseDto> getUserById(Integer id) {
        return userRepository.findById(id)
                .map(UserMapper::toResponseDto);
    }

    @Override
    public Optional<UserResponseDto> getUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .map(UserMapper::toResponseDto);
    }

    @Override

    public UserResponseDto updateUser(Integer id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserMapper.updateEntity(user, dto);

        return UserMapper.toResponseDto(userRepository.save(user));
    }


    @Override
    public void deleteUserById(Integer id) {
        userRepository.deleteById(id);
    }
}
