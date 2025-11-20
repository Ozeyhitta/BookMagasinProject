package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.enums.EMethod;
import com.bookmagasin.enums.EStatusBooking;
import com.bookmagasin.enums.EStatusPayment;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDto {
    private int id;
    private String userFullName;
    private String serviceName;

    private String paymentMethod;
    private String paymentStatus;
    private double paymentAmount;

    private String note;
    private EStatusBooking status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime orderDate;

    private String shippingAddress;
    private String phoneNumber;
    private Double totalPrice;

    private List<OrderItemResponseDto> items;
    private List<OrderStatusHistoryResponseDto> orderStatusHistories;
}



