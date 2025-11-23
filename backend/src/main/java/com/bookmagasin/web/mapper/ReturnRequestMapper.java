package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.ReturnRequest;
import com.bookmagasin.web.dtoResponse.ReturnRequestResponseDto;

public class ReturnRequestMapper {
    
    public static ReturnRequestResponseDto toResponseDto(ReturnRequest request) {
        ReturnRequestResponseDto dto = new ReturnRequestResponseDto();
        dto.setReturnRequestId(request.getId());
        dto.setOrderId(request.getOrder() != null ? request.getOrder().getId() : 0);
        dto.setOrderItemId(request.getOrderItem() != null ? request.getOrderItem().getId() : 0);
        dto.setOrderDisplayId(request.getOrder() != null ? "ORD-" + String.format("%04d", request.getOrder().getId()) : "");
        dto.setBookTitle(request.getOrderItem() != null && request.getOrderItem().getBook() != null 
            ? request.getOrderItem().getBook().getTitle() : "");
        dto.setQuantity(request.getQuantity());
        dto.setReason(request.getReason());
        dto.setStatus(request.getStatus());
        dto.setRequestDate(request.getRequestDate());
        dto.setProcessedDate(request.getProcessedDate());
        dto.setProcessedBy(request.getProcessedBy() != null ? request.getProcessedBy().getId() : null);
        dto.setProcessedByName(request.getProcessedBy() != null ? request.getProcessedBy().getFullName() : null);
        
        // Extract rejectionReason từ reason field nếu có format [Lý do từ chối: ...]
        if (request.getReason() != null && request.getReason().contains("[Lý do từ chối:")) {
            String reasonText = request.getReason();
            int startIdx = reasonText.indexOf("[Lý do từ chối:") + "[Lý do từ chối:".length();
            int endIdx = reasonText.indexOf("]", startIdx);
            if (endIdx > startIdx) {
                String extractedReason = reasonText.substring(startIdx, endIdx).trim();
                dto.setRejectionReason(extractedReason);
            }
        }
        
        return dto;
    }
}

