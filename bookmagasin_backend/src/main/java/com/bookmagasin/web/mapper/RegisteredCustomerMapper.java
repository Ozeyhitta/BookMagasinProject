package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.RegisteredCustomer;
import com.bookmagasin.web.dto.RegisteredCustomerDto;
import com.bookmagasin.web.dtoResponse.RegisteredCustomerResponseDto;

import java.util.Date;
import java.util.stream.Collectors;

// RegisteredCustomerMapper.java
public class RegisteredCustomerMapper {

    public static RegisteredCustomer toEntity(RegisteredCustomerDto dto, Account account) {
        RegisteredCustomer rc = new RegisteredCustomer();
        rc.setFullName(dto.getFullName());
        rc.setAccount(account);
        rc.setRegistrationDate(new Date());
        rc.setLoyalPoint(0);
        return rc;
    }


    public static RegisteredCustomerResponseDto toResponseDto(RegisteredCustomer rc) {
        RegisteredCustomerResponseDto dto = new RegisteredCustomerResponseDto();
        dto.setId(rc.getId());
        dto.setFullName(rc.getFullName());
        dto.setPhoneNumber(rc.getPhoneNumber());
        dto.setAddress(rc.getAddress());
        dto.setGender(rc.getGender());
        dto.setDateOfBirth(rc.getDateOfBirth());
        dto.setAvatarUrl(rc.getAvatarUrl());
        dto.setLoyalPoint(rc.getLoyalPoint());
        dto.setRegistrationDate(rc.getRegistrationDate());

        if (rc.getOrderHistory() != null) {
            dto.setOrderIds(
                    rc.getOrderHistory().stream().map(Order::getId).collect(Collectors.toList())
            );
        }
        return dto;
    }
}

