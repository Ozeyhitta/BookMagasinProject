package com.bookmagasin.repository;

import com.bookmagasin.entity.Account;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account,Integer> {

    @EntityGraph(attributePaths = {"user"})
    Optional<Account> findByEmail(String email);

    boolean existsByEmail(String email);
}
