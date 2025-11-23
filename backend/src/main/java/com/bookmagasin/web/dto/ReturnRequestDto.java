package com.bookmagasin.web.dto;

import lombok.Data;

@Data
public class ReturnRequestDto {
    private Integer orderId;      // id của đơn hàng
    private Integer orderItemId;  // id của item trong đơn hàng
    private Integer quantity;     // số lượng muốn trả
    private String reason;        // lý do trả
}
