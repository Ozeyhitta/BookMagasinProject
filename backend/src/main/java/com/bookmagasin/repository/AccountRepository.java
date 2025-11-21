package com.bookmagasin.repository;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

    @EntityGraph(attributePaths = {"user", "roles"})
    Optional<Account> findByEmail(String email);

    boolean existsByEmail(String email);

    // 🆕 tìm account theo user (dựa vào cột user_id trong bảng account)
    @EntityGraph(attributePaths = {"user", "roles"})
    Optional<Account> findByUser(User user);
}
