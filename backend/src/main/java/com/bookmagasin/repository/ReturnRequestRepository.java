package com.bookmagasin.repository;

import com.bookmagasin.entity.ReturnRequest;
import com.bookmagasin.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Integer> {
    List<ReturnRequest> findByStatus(RequestStatus status);
    List<ReturnRequest> findByOrder_Id(Integer orderId);
    Optional<ReturnRequest> findByOrder_IdAndOrderItem_Id(Integer orderId, Integer orderItemId);
}

