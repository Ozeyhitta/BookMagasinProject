package com.bookmagasin.web.controller;


import com.bookmagasin.entity.Payment;
import com.bookmagasin.service.PaymentService;
import com.bookmagasin.service.VnPayService;
import com.bookmagasin.web.dto.PaymentDto;
import com.bookmagasin.web.dtoResponse.PaymentResponseDto;
import com.bookmagasin.web.dtoResponse.VnPayInitResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {
    private final PaymentService paymentService;
    private final VnPayService vnPayService;
    public PaymentController(PaymentService paymentService, VnPayService vnPayService) {
        this.paymentService = paymentService;
        this.vnPayService = vnPayService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<PaymentResponseDto> createPayment(@RequestBody PaymentDto dto) {
        PaymentResponseDto created = paymentService.createPayment(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<PaymentResponseDto>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDto> getPaymentById(@PathVariable Integer id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponseDto> updatePayment(@PathVariable Integer id,
                                                            @RequestBody PaymentDto dto) {
        try {
            PaymentResponseDto updated = paymentService.updatePayment(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Integer id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }


//    @GetMapping("/vnpay/create")
//    public ResponseEntity<?> createPayPayment(@RequestParam Double amount,
//                                              @RequestParam(required = false) String orderInfo,
//                                              @RequestParam(required = false) String bankCode,
//                                              @RequestParam(required = false) String locale,
//                                              HttpServletRequest request) {
//        String clientIp = extractClientIp(request);
//        return ResponseEntity.ok(vnPayService.createPaymentUrl(amount, orderInfo, bankCode, locale, clientIp));
//    }
//
//    @GetMapping("/vnpay/return")
//    public void vnPayReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
//        Map<String ,String> flat=flattenRequestParams(request);
//
//        Payment payment=vnPayService.handleCallback(flat);
//
//        response.setContentType("text/html;charset=UTF-8");
//        response.getWriter().write(
//                "<!DOCTYPE html>" +
//                "<html>" +
//                "<head>" +
//                "<meta charset='UTF-8'/>" +
//                "<title>Đang chuyển hướng...</title>" +
//                "<style>" +
//                "body { font-family: sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; background:#f9fafb; }" +
//                ".card { background:#fff; padding:32px; border-radius:10px; box-shadow:0 4px 20px rgba(0,0,0,0.1); text-align:center; max-width:360px; }" +
//                ".spinner { width:48px; height:48px; border:4px solid #e5e7eb; border-top-color:#2563eb; border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 16px; }" +
//                "@keyframes spin { to { transform: rotate(360deg); } }" +
//                "</style>" +
//                "</head>" +
//                "<body>" +
//                "<div class='card'>" +
//                "<div class='spinner'></div>" +
//                "<h2>Đang chuyển hướng...</h2>" +
//                "<p>Vui lòng chờ trong giây lát.</p>" +
//                "</div>" +
//                "<script>" +
//                "window.opener && window.opener.postMessage({" +
//                "  type: 'vnpayResult'," +
//                "  status: '" + payment.getPaymentStatus() + "'," +
//                "  amount: '" + payment.getAmount() + "'," +
//                "  paymentId: '" + payment.getId() + "'," +
//                "  vnpTxnRef: '" + payment.getVnpTxnRef() + "'" +
//                "}, '*');" +
//                "setTimeout(function(){ window.close(); }, 1000);" +
//                "</script>" +
//                "</body>" +
//                "</html>"
//        );
//    }
//
//    @GetMapping("/vnpay/ipn")
//    public ResponseEntity<String> vnPayIpn(HttpServletRequest request) {
//        Map<String, String> params = flattenRequestParams(request);
//        boolean valid = vnPayService.verifyIpn(params);
//
//        if (valid) {
//            return ResponseEntity.ok("OK");
//        } else {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID");
//        }
//    }
//
//    private Map<String, String> flattenRequestParams(HttpServletRequest request) {
//        Map<String, String> flat = new HashMap<>();
//        request.getParameterMap().forEach((k, v) -> {
//            if (v != null && v.length > 0) {
//                flat.put(k, v[0]);
//            }
//        });
//        return flat;
//    }
//
//    private String extractClientIp(HttpServletRequest request) {
//        String xForwardedFor = request.getHeader("X-Forwarded-For");
//        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
//            return xForwardedFor.split(",")[0].trim();
//        }
//        String realIp = request.getHeader("X-Real-IP");
//        if (realIp != null && !realIp.isBlank()) {
//            return realIp;
//        }
//        return request.getRemoteAddr();
//    }

    @GetMapping("/vnpay/create")
    public ResponseEntity<VnPayInitResponse> createPayPayment(@RequestParam Double amount,
                                                              @RequestParam(required = false) String orderInfo,
                                                              @RequestParam(required = false) String bankCode,
                                                              @RequestParam(required = false) String locale,
                                                              HttpServletRequest request) {

        String clientIp = extractClientIp(request);

        VnPayInitResponse res = vnPayService.createPaymentUrl(amount, orderInfo, bankCode, locale, clientIp);
        log.info("🟢 VNPay init response: {}", res);

        return ResponseEntity.ok(res); // Trả nguyên response JSON
    }


    // ============================
    // 🚀 VNPay RETURN
    // ============================

    @GetMapping("/vnpay/return")
    public void vnPayReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {

        Map<String ,String> flat = flattenRequestParams(request);

        log.info("📥 VNPay RETURN RAW PARAMS: {}", flat);

        Payment payment = vnPayService.handleCallback(flat);

        log.info("✔ VNPay CALLBACK PROCESSED: id={}, txnRef={}, status={}", payment.getId(), payment.getVnpTxnRef(), payment.getPaymentStatus());

        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().write(
                "<!DOCTYPE html>" +
                        "<html>" +
                        "<head>" +
                        "<meta charset='UTF-8'/>" +
                        "<title>Đang chuyển hướng...</title>" +
                        "<style>" +
                        "body { font-family: sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; background:#f9fafb; }" +
                        ".card { background:#fff; padding:32px; border-radius:10px; box-shadow:0 4px 20px rgba(0,0,0,0.1); text-align:center; max-width:360px; }" +
                        ".spinner { width:48px; height:48px; border:4px solid #e5e7eb; border-top-color:#2563eb; border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 16px; }" +
                        "@keyframes spin { to { transform: rotate(360deg); } }" +
                        "</style>" +
                        "</head>" +
                        "<body>" +
                        "<div class='card'>" +
                        "<div class='spinner'></div>" +
                        "<h2>Đang chuyển hướng...</h2>" +
                        "<p>Vui lòng chờ trong giây lát.</p>" +
                        "</div>" +
                        "<script>" +
                        "console.log('Sending postMessage to opener...');" +
                        "window.opener && window.opener.postMessage({" +
                        "  type: 'vnpayResult'," +
                        "  status: '" + payment.getPaymentStatus() + "'," +
                        "  amount: '" + payment.getAmount() + "'," +
                        "  paymentId: '" + payment.getId() + "'," +
                        "  vnpTxnRef: '" + (payment.getVnpTxnRef() != null ? payment.getVnpTxnRef() : "") + "'," +
                        "  errorMessage: " + (payment.getErrorMessage() != null ? "'" + payment.getErrorMessage().replace("'", "\\'") + "'" : "null") +
                        "}, '*');" +
                        "setTimeout(function(){ console.log('Closing popup...'); window.close(); }, 1000);" +
                        "</script>" +
                        "</body>" +
                        "</html>"
        );
    }

    // ============================
    // 🚀 VNPay IPN
    // ============================

    @GetMapping("/vnpay/ipn")
    public ResponseEntity<String> vnPayIpn(HttpServletRequest request) {
        Map<String, String> params = flattenRequestParams(request);

        log.info("📥 VNPay IPN RECEIVED: {}", params);

        boolean valid = vnPayService.verifyIpn(new HashMap<>(params));

        log.info("🔍 VNPay IPN CHECKSUM VALID = {}", valid);

        if (!valid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID");
        }

        try {
            vnPayService.handleCallback(new HashMap<>(params));
            log.info("✅ VNPay IPN processed -> txnRef={}", params.get("vnp_TxnRef"));
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            log.error("❌ Failed processing VNPay IPN", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("ERROR");
        }
    }

    // ============================
    // Helpers
    // ============================

    private Map<String, String> flattenRequestParams(HttpServletRequest request) {
        Map<String, String> flat = new HashMap<>();
        request.getParameterMap().forEach((k, v) -> {
            if (v != null && v.length > 0) {
                flat.put(k, v[0]);
            }
        });
        return flat;
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        String realIp = request.getHeader("X-Real-IP");

        String ip = (xForwardedFor != null && !xForwardedFor.isBlank())
                ? xForwardedFor.split(",")[0].trim()
                : (realIp != null && !realIp.isBlank())
                ? realIp
                : request.getRemoteAddr();

        log.info("📌 Extracted Client IP: {}", ip);
        return ip;
    }

}
