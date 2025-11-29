package com.bookmagasin.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_request")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String email;

    private String type; // e.g., "Đơn hàng", "Sản phẩm", "Thanh toán", ...

    private String issue; // short title

    @Column(columnDefinition = "TEXT")
    private String description;

    private String status; // OPEN, RESOLVED

    @Column(columnDefinition = "TEXT")
    private String staffResponse;

    private Integer staffId;

    private String staffName;

    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

}
