package com.bookmagasin.repository;

import com.bookmagasin.entity.StaffRequest;
import com.bookmagasin.entity.User;
import com.bookmagasin.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StaffRequestRepository extends JpaRepository<StaffRequest, Integer> {

    List<StaffRequest> findByStatus(RequestStatus status);

    // 🔹 Lấy request mới nhất của 1 user
    Optional<StaffRequest> findTopByUserOrderByIdDesc(User user);

    // 🔹 Lấy tất cả request PENDING của 1 user
    List<StaffRequest> findByUserAndStatus(User user, RequestStatus status);
}
