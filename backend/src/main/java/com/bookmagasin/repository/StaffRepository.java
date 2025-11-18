package com.bookmagasin.repository;

import com.bookmagasin.entity.Staff;
import com.bookmagasin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Integer> {
    Optional<Staff> findByUser(User user);
}
