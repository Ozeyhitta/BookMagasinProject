package com.bookmagasin.web.controller;

import com.bookmagasin.entity.User;
import com.bookmagasin.service.UserService;
import com.bookmagasin.web.dto.UserDto;
import com.bookmagasin.web.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // Để React truy cập
public class UserController {

    @Autowired
    private UserService userService;

    // CREATE
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        User saved = userService.saveUser(UserMapper.toEntity(userDto));
        return ResponseEntity.ok(UserMapper.toDto(saved));
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers()
                .stream().map(UserMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Integer id) {
        Optional<User> userOpt = userService.getUserById(id);
        return userOpt.map(user -> ResponseEntity.ok(UserMapper.toDto(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Integer id, @RequestBody UserDto userDto) {
        Optional<User> existing = userService.getUserById(id);
        if (existing.isPresent()) {
            User user = existing.get();
            user.setFullName(userDto.getFullName());
            user.setDateOfBirth(userDto.getDateOfBirth());
            user.setGender(userDto.getGender());
            user.setPhoneNumber(userDto.getPhoneNumber());
            user.setAddress(userDto.getAddress());
            user.setAvatarUrl(userDto.getAvatarUrl());
            User updated = userService.saveUser(user);
            return ResponseEntity.ok(UserMapper.toDto(updated));
        }
        return ResponseEntity.notFound().build();
    }
}
