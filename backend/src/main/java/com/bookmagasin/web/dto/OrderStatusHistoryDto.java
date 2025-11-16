package com.bookmagasin.web.dto;

import com.bookmagasin.enums.EOrderHistory;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusHistoryDto {
    private Integer id;
    
    private EOrderHistory eOrderHistory;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date statusChangeDate;
    
    private Integer orderId; // Chỉ cần ID của Order
}

