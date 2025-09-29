package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.enums.EMethod;
import com.bookmagasin.enums.EStatusBooking;
import com.bookmagasin.enums.EStatusPayment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private int id;
    private String note;
    private EStatusBooking status;
    private Date orderDate;

    private String userFullName;
    private String serviceName;
    private Double paymentAmount;
    private EMethod paymentMethod;
    private EStatusPayment paymentStatus;
}

