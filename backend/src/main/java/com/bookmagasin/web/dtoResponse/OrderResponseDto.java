package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.enums.EMethod;
import com.bookmagasin.enums.EStatusBooking;
import com.bookmagasin.enums.EStatusPayment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Date orderDate;

    private String shippingAddress;
    private String phoneNumber;
    private Double totalPrice;

    private List<OrderItemResponseDto> items;
}



