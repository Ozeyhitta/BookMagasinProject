package com.bookmagasin.service;

import com.bookmagasin.entity.Cart;
import com.bookmagasin.web.dto.CartDto;
import com.bookmagasin.web.dtoResponse.CartResponseDto;

import java.util.List;
import java.util.Optional;

public interface CartService {
    List<CartResponseDto> findAll();
    Optional<CartResponseDto> findById(int id);
    List<CartResponseDto> findByUserId(int userId);
    CartResponseDto createCart(CartDto dto);
    CartResponseDto updateCart(int id, CartDto dto);
    void deleteCartById(int id);


}
