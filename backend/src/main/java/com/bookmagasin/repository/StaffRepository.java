package com.bookmagasin.repository;

import com.bookmagasin.entity.Staff;
import com.bookmagasin.entity.User;
import com.bookmagasin.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Integer> {
    Optional<Staff> findByUser(User user);
    List<Staff> findByStatus(RequestStatus status);
}
