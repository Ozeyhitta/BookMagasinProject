package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.enums.EMethod;
import com.bookmagasin.enums.EStatusPayment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private Integer id;
    private Double amount;
    private EMethod method;
    private EStatusPayment paymentStatus;
    private String errorMessage;  // Thông báo lỗi chi tiết từ VNPay
    private String vnpTxnRef;      // Mã giao dịch VNPay
}

