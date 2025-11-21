package com.bookmagasin.repository;

import com.bookmagasin.entity.Role;
import com.bookmagasin.enums.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRole(ERole role);
}

