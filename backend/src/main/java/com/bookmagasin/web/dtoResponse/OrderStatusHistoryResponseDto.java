package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.enums.EOrderHistory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusHistoryResponseDto {
    private int id;
    private EOrderHistory eOrderHistory;
    private Date statusChangeDate;
}

