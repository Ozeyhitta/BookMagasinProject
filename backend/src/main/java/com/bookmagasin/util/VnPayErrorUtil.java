package com.bookmagasin.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Utility class để map VNPay response code sang thông báo lỗi tiếng Việt
 */
public class VnPayErrorUtil {
    
    private static final Map<String, String> ERROR_MESSAGES = new HashMap<>();
    
    static {
        // Mã lỗi thành công
        ERROR_MESSAGES.put("00", "Giao dịch thành công");
        
        // Mã lỗi thẻ test VNPay Sandbox
        ERROR_MESSAGES.put("07", "Trừ tiền thành công nhưng thẻ bị trừ lại (giao dịch bị nghi ngờ)");
        ERROR_MESSAGES.put("09", "Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking");
        ERROR_MESSAGES.put("10", "Xác thực thông tin thẻ/tài khoản không đúng");
        ERROR_MESSAGES.put("11", "Đã hết hạn chờ thanh toán");
        ERROR_MESSAGES.put("12", "Thẻ/Tài khoản bị khóa");
        ERROR_MESSAGES.put("13", "Nhập sai mật khẩu xác thực giao dịch (OTP)");
        ERROR_MESSAGES.put("51", "Tài khoản không đủ số dư để thực hiện giao dịch");
        ERROR_MESSAGES.put("65", "Tài khoản đã vượt quá hạn mức giao dịch cho phép");
        ERROR_MESSAGES.put("75", "Ngân hàng thanh toán đang bảo trì");
        ERROR_MESSAGES.put("79", "Nhập sai mật khẩu thanh toán quá số lần quy định");
        
        // Mã lỗi khác
        ERROR_MESSAGES.put("99", "Lỗi không xác định");
    }
    
    /**
     * Lấy thông báo lỗi từ response code
     * @param responseCode Mã phản hồi từ VNPay
     * @return Thông báo lỗi tiếng Việt
     */
    public static String getErrorMessage(String responseCode) {
        if (responseCode == null || responseCode.isBlank()) {
            return "Không xác định được mã lỗi";
        }
        
        String message = ERROR_MESSAGES.get(responseCode);
        if (message != null) {
            return message;
        }
        
        // Nếu không tìm thấy, trả về thông báo mặc định
        return "Giao dịch thất bại (Mã lỗi: " + responseCode + ")";
    }
    
    /**
     * Kiểm tra xem response code có phải là thành công không
     */
    public static boolean isSuccess(String responseCode) {
        return "00".equals(responseCode);
    }
}

