package com.bookmagasin.web.dto;

import com.bookmagasin.enums.EMethod;
import com.bookmagasin.enums.EStatusPayment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {
    private Double amount;
    private EMethod method;
    private EStatusPayment paymentStatus;
}

