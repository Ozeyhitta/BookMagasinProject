package com.bookmagasin.service;

import com.bookmagasin.entity.Account;
import com.bookmagasin.web.dto.RegisterCustomerDto;

public interface AuthService {
    Account registerCustomer(RegisterCustomerDto dto);
}

