package com.bookmagasin.service;

import com.bookmagasin.entity.Account;
import com.bookmagasin.web.dto.RegisteredCustomerDto;

public interface AuthService {
    Account registerCustomer(RegisteredCustomerDto dto);
}

