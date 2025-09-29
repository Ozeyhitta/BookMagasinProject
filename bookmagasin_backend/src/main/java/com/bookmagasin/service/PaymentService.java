package com.bookmagasin.service;

import com.bookmagasin.web.dto.PaymentDto;
import com.bookmagasin.web.dtoResponse.PaymentResponseDto;

import java.util.List;
import java.util.Optional;

public interface PaymentService {
    PaymentResponseDto createPayment(PaymentDto dto);
    List<PaymentResponseDto> getAllPayments();
    Optional<PaymentResponseDto> getPaymentById(Integer id);
    PaymentResponseDto updatePayment(Integer id, PaymentDto dto);
    void deletePayment(Integer id);
}

