package com.bookmagasin.service;


import com.bookmagasin.entity.User;

import java.util.List;
import java.util.Optional;


public interface UserService {
    User saveUser(User user);
    List<User> getAllUsers();
    Optional<User> getUserById(Integer id);
    Optional<User> getUserByPhoneNumber(String phoneNumber);
    User getUserByFullName(String fullName);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByFullName(String fullName);
    void deleteUserById(Integer id);
    void deleteUser(User user);

}
