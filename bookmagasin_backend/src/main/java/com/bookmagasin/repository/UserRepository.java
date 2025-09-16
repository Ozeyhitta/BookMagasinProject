package com.bookmagasin.repository;

import com.bookmagasin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    // 🟢 Create (save handled by JpaRepository)
    // User save(User user); --> đã có sẵn

    // 🔵 Read
    List<User> findAll();
    Optional<User> findById(Integer id);
    User findByFullName(String fullName);
    Optional<User> findByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByFullName(String fullName);

    // 🔴 Update
    // Không cần hàm riêng - dùng lại save(user)

    // ⚫ Delete
    void deleteById(Integer id);
    void delete(User user);

}
