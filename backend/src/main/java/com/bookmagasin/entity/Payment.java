package com.bookmagasin.entity;

import com.bookmagasin.config.PaymentStatusConverter;
import com.bookmagasin.enums.EMethod;
import com.bookmagasin.enums.EStatusPayment;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "payment")
@Getter
@Setter
@ToString(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "amount")
    private Double amount;

    @Column(name = "method")
    @Enumerated(EnumType.STRING)
    private EMethod method;

    @Column(name = "payment_status")
    @Convert(converter = PaymentStatusConverter.class)
    private EStatusPayment paymentStatus;

    @OneToMany(mappedBy = "payment")
    private List<Order> orders;

    @Column(name = "vnp_txn_ref")
    private String vnpTxnRef;           // Mã đơn hàng gửi sang VNPay
    @Column(name = "vnp_transaction_no")
    private String vnpTransactionNo;    // Mã giao dịch VNPay trả về

    @Column(name = "bank_code")
    private String bankCode;
    @Column(name = "pay_date")
    private LocalDateTime payDate;
    
    @Column(name = "error_message", length = 500)
    private String errorMessage;  // Thông báo lỗi chi tiết từ VNPay
}
