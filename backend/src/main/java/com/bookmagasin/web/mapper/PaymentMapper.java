package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Payment;
import com.bookmagasin.web.dto.PaymentDto;
import com.bookmagasin.web.dtoResponse.PaymentResponseDto;

public class PaymentMapper {

    public static PaymentResponseDto toResponseDto(Payment payment) {
        return new PaymentResponseDto(
                payment.getId(),
                payment.getAmount(),
                payment.getMethod(),
                payment.getPaymentStatus(),
                payment.getErrorMessage(),
                payment.getVnpTxnRef()
        );
    }

    public static Payment toEntity(PaymentDto dto) {
        Payment payment = new Payment();
        payment.setAmount(dto.getAmount());
        payment.setMethod(dto.getMethod());
        payment.setPaymentStatus(dto.getPaymentStatus());
        return payment;
    }
}

