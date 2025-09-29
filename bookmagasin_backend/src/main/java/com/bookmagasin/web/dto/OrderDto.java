package com.bookmagasin.web.dto;

import com.bookmagasin.enums.EStatusBooking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private int userId;
    private String note;
    private EStatusBooking status;
    private Date orderDate;
    private int serviceId;
    private int paymentId;
}
