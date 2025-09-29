package com.bookmagasin.repository;

import com.bookmagasin.entity.RegisteredCustomer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegisteredCustomerRepository extends JpaRepository<RegisteredCustomer,Integer> {
}
