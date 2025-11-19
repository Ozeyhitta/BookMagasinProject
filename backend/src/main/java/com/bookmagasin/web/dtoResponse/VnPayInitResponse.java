package com.bookmagasin.web.dtoResponse;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VnPayInitResponse {
    private String paymentUrl;
    private Integer paymentId;
    private String vnpTxnRef;
}

