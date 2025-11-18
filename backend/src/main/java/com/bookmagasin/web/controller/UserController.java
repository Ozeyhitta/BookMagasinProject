package com.bookmagasin.web.controller;

import com.bookmagasin.entity.User;
import com.bookmagasin.service.UserService;
import com.bookmagasin.web.dto.UserDto;
import com.bookmagasin.web.dtoResponse.UserResponseDto;
import com.bookmagasin.web.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // Để React truy cập
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // CREATE
    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(@RequestBody UserDto dto) {
        UserResponseDto created=userService.createUser(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get user by phone
    @GetMapping("/phone/{phone}")
    public ResponseEntity<UserResponseDto> getUserByPhone(@PathVariable String phone) {
        return userService.getUserByPhoneNumber(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUser(@PathVariable Integer id,@RequestBody UserDto dto){
        try {
            UserResponseDto updated=userService.updateUser(id,dto);
            return ResponseEntity.ok(updated);

        }catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }


}
