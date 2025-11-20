package com.bookmagasin.service;

import com.bookmagasin.entity.Payment;
import com.bookmagasin.web.dtoResponse.VnPayInitResponse;

import java.util.Map;

public interface VnPayService {
    VnPayInitResponse createPaymentUrl(Double amount,
                                       String orderInfo,
                                       String bankCode,
                                       String locale,
                                       String clientIp);
    Payment handleCallback(Map<String, String> params);
    boolean verifyIpn(Map<String, String> params);

}
