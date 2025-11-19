package com.bookmagasin.service.impl;

import com.bookmagasin.config.VnPayConfig;
import com.bookmagasin.entity.Payment;
import com.bookmagasin.enums.EMethod;
import com.bookmagasin.enums.EStatusPayment;
import com.bookmagasin.repository.PaymentRepository;
import com.bookmagasin.service.VnPayService;
import com.bookmagasin.util.VnPayErrorUtil;
import com.bookmagasin.web.dtoResponse.VnPayInitResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.text.Normalizer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

@Slf4j
@Service
public class VnPayServiceImpl implements VnPayService {

    private final VnPayConfig vnPayConfig;
    private final PaymentRepository paymentRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    public VnPayServiceImpl(VnPayConfig vnPayConfig, PaymentRepository paymentRepository) {
        this.vnPayConfig = vnPayConfig;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public VnPayInitResponse createPaymentUrl(Double amount,
                                              String orderInfo,
                                              String bankCode,
                                              String locale,
                                              String clientIp) {

        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        String normalizedOrderInfo = buildOrderInfo(orderInfo);
        String resolvedLocale = (locale == null || locale.isBlank()) ? "vn" : locale;
        String resolvedIp = (clientIp == null || clientIp.isBlank()) ? "127.0.0.1" : clientIp;

        log.info("🔵 [VNPAY] Bắt đầu tạo paymentUrl amount={}, orderInfo={}, bankCode={}, locale={}, ip={}",
                amount, normalizedOrderInfo, bankCode, resolvedLocale, resolvedIp);

        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        params.put("vnp_Amount", String.valueOf(Math.round(amount * 100)));
        params.put("vnp_CurrCode", "VND");

        String txnRef = randomTxnRef();
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", normalizedOrderInfo != null ? normalizedOrderInfo : "Thanh toan don hang " + txnRef);
        params.put("vnp_OrderType", "billpayment");
        params.put("vnp_Locale", resolvedLocale);
        params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        params.put("vnp_IpAddr", resolvedIp);

        if (bankCode != null && !bankCode.isBlank()) {
            params.put("vnp_BankCode", bankCode);
        }

        TimeZone gmtPlus7 = TimeZone.getTimeZone("GMT+7");

        Calendar calendar = Calendar.getInstance(gmtPlus7);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(gmtPlus7);

        params.put("vnp_CreateDate", formatter.format(calendar.getTime()));
        calendar.add(Calendar.MINUTE, 15);
        params.put("vnp_ExpireDate", formatter.format(calendar.getTime()));

        Payment pendingPayment = persistPendingPayment(txnRef, amount);

        SignedPayload payload = buildSignedPayload(params, true);

        log.info("🟠 [VNPAY] hashData={}", payload.hashData());
        log.info("🟢 [VNPAY] secureHash={}", payload.secureHash());

        String paymentUrl = vnPayConfig.getPayUrl() + "?" + payload.query();
        log.info("🟩 URL thanh toán: {}", paymentUrl);

        return new VnPayInitResponse(paymentUrl, pendingPayment.getId(), txnRef);
    }


    @Override
    public Payment handleCallback(Map<String, String> params) {
        log.info("📥 [VNPAY RETURN] Nhận params: {}", params);

        if (!verifyChecksum(params)) {
            log.error("❌ Sai checksum khi xử lý ReturnUrl");
            throw new RuntimeException("Sai chữ ký");
        }

        String txnRef = params.get("vnp_TxnRef");
        Payment payment = paymentRepository.findByVnpTxnRef(txnRef);
        if (payment == null) {
            throw new RuntimeException("Payment not found");
        }

        String responseCode = params.get("vnp_ResponseCode");
        String vnpTransactionNo = params.get("vnp_TransactionNo");
        String vnpBankCode = params.get("vnp_BankCode");

        if (VnPayErrorUtil.isSuccess(responseCode)) {
            payment.setPaymentStatus(EStatusPayment.SUCCESS);
            payment.setErrorMessage(null); // Xóa lỗi nếu thành công
            if (vnpTransactionNo != null) {
                payment.setVnpTransactionNo(vnpTransactionNo);
            }
            if (vnpBankCode != null) {
                payment.setBankCode(vnpBankCode);
            }
        } else {
            payment.setPaymentStatus(EStatusPayment.FAILED);
            // Lưu thông báo lỗi chi tiết
            String errorMessage = VnPayErrorUtil.getErrorMessage(responseCode);
            payment.setErrorMessage(errorMessage);
            log.warn("❌ [VNPAY] Thanh toán thất bại: responseCode={}, error={}", responseCode, errorMessage);
        }

        Payment saved = paymentRepository.save(payment);

        log.info("✔ Cập nhật payment: txnRef={}, status={}, amount={}",
                saved.getVnpTxnRef(),
                saved.getPaymentStatus(),
                saved.getAmount());
        return saved;
    }

    @Override
    public boolean verifyIpn(Map<String, String> params) {

        log.info("📥 [VNPAY IPN] Nhận params: {}", params);

        boolean checksumOK = verifyChecksum(params);

        log.info("🔍 Verify IPN checksum = {}", checksumOK);

        return checksumOK;
    }


    private boolean verifyChecksum(Map<String, String> params) {

        log.info("🔎 [CHECKSUM] Dữ liệu nhận: {}", params);

        String receivedHash = params.get("vnp_SecureHash");
        log.info("🔐 Hash nhận từ VNPAY: {}", receivedHash);

        if (receivedHash == null) {
            return false;
        }

        Map<String, String> filtered = new HashMap<>(params);
        filtered.remove("vnp_SecureHash");
        filtered.remove("vnp_SecureHashType");

        SignedPayload payload = buildSignedPayload(filtered, false);

        log.info("🟠 [VNPAY] hashData verify: {}", payload.hashData());
        log.info("🟢 [VNPAY] secureHash expected={}, actual={}", payload.secureHash(), receivedHash);

        return receivedHash.equalsIgnoreCase(payload.secureHash());
    }



    private String randomTxnRef() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 8; i++) sb.append(RANDOM.nextInt(10));
        return sb.toString();
    }

    private Payment persistPendingPayment(String txnRef, Double amount) {
        Payment payment = paymentRepository.findByVnpTxnRef(txnRef);
        if (payment == null) {
            payment = new Payment();
            payment.setVnpTxnRef(txnRef);
        }
        payment.setAmount(amount);
        payment.setMethod(EMethod.VNPAY);
        payment.setPaymentStatus(EStatusPayment.PENDING);
        Payment saved = paymentRepository.save(payment);
        log.info("💾 [VNPAY] Lưu Payment PENDING: txnRef={}, amount={}, id={}", txnRef, amount, saved.getId());
        return saved;
    }

    private SignedPayload buildSignedPayload(Map<String, String> params, boolean appendSecureHashToQuery) {
        List<String> fieldNames = new ArrayList<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                fieldNames.add(entry.getKey());
            }
        }
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = params.get(fieldName);

            hashData.append(fieldName)
                    .append('=')
                    .append(urlEncodeValue(fieldValue));

            query.append(urlEncodeKey(fieldName))
                    .append('=')
                    .append(urlEncodeValue(fieldValue));

            if (i < fieldNames.size() - 1) {
                hashData.append('&');
                query.append('&');
            }
        }

        String secureHash = vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        if (appendSecureHashToQuery) {
            query.append("&vnp_SecureHashType=HmacSHA512&vnp_SecureHash=").append(secureHash);
        }

        return new SignedPayload(hashData.toString(), query.toString(), secureHash);
    }

    private String urlEncodeValue(String value) {
        try {
            return URLEncoder.encode(value, StandardCharsets.US_ASCII.toString());
        } catch (Exception e) {
            throw new RuntimeException("Cannot encode value", e);
        }
    }

    private String urlEncodeKey(String value) {
        return urlEncodeValue(value);
    }

    private String buildOrderInfo(String rawOrderInfo) {
        if (rawOrderInfo == null || rawOrderInfo.isBlank()) {
            return null;
        }
        String normalized = Normalizer.normalize(rawOrderInfo, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return normalized.replaceAll("[^A-Za-z0-9 ]", " ").replaceAll("\\s+", " ").trim();
    }

    private record SignedPayload(String hashData, String query, String secureHash) {
    }
}
