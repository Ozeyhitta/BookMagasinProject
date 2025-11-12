package com.bookmagasin.web.dto;

import com.bookmagasin.enums.EStatusBooking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Integer userId;
    private Integer serviceId;
    private Integer paymentId;
    private String note;
    private String status;
    private Date orderDate;
    private String shippingAddress;
    private String phoneNumber;
    private List<OrderItemDto> cartItems;
}
