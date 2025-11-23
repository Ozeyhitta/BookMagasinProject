package com.bookmagasin.service;

import com.bookmagasin.web.dtoResponse.ReturnRequestResponseDto;

import java.util.List;
import java.util.Optional;

public interface ReturnRequestService {
    ReturnRequestResponseDto createReturnRequest(Integer orderId, Integer orderItemId, Integer quantity, String reason);
    List<ReturnRequestResponseDto> getAllReturnRequests();
    List<ReturnRequestResponseDto> getReturnRequestsByStatus(String status);
    Optional<ReturnRequestResponseDto> getReturnRequestById(Integer id);
    ReturnRequestResponseDto approveReturnRequest(Integer id, Integer staffId);
    ReturnRequestResponseDto rejectReturnRequest(Integer id, Integer staffId, String rejectionReason);
    List<ReturnRequestResponseDto> getReturnRequestsByOrderId(Integer orderId);


}

