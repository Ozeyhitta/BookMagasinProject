package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Payment;
import com.bookmagasin.repository.PaymentRepository;
import com.bookmagasin.service.PaymentService;
import com.bookmagasin.web.dto.PaymentDto;
import com.bookmagasin.web.dtoResponse.PaymentResponseDto;
import com.bookmagasin.web.mapper.PaymentMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public PaymentResponseDto createPayment(PaymentDto dto) {
        Payment payment= PaymentMapper.toEntity(dto);
        return PaymentMapper.toResponseDto(paymentRepository.save(payment));
    }

    @Override
    public List<PaymentResponseDto> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(PaymentMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PaymentResponseDto> getPaymentById(Integer id) {
        return paymentRepository.findById(id)
                .map(PaymentMapper::toResponseDto);
    }

    @Override
    public PaymentResponseDto updatePayment(Integer id, PaymentDto dto) {
        Payment payment=paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setAmount(dto.getAmount());
        payment.setMethod(dto.getMethod());
        payment.setPaymentStatus(dto.getPaymentStatus());
        return PaymentMapper.toResponseDto(paymentRepository.save(payment));
    }

    @Override
    public void deletePayment(Integer id) {
        paymentRepository.deleteById(id);
    }
}
