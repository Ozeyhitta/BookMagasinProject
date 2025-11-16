package com.bookmagasin.repository;

import com.bookmagasin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User> findByPhoneNumber(String phoneNumber);
    User findByFullName(String fullName);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByFullName(String fullName);

}
