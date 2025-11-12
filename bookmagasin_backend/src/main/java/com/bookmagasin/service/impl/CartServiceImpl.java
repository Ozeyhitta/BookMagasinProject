package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.Cart;
import com.bookmagasin.entity.User;
import com.bookmagasin.repository.BookRepository;
import com.bookmagasin.repository.CartRepository;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.service.CartService;
import com.bookmagasin.web.dto.CartDto;
import com.bookmagasin.web.dtoResponse.CartResponseDto;
import com.bookmagasin.web.mapper.CartMapper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public CartServiceImpl(CartRepository cartRepository, UserRepository userRepository, BookRepository bookRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }


    @Override
    public List<CartResponseDto> findAll() {
        return cartRepository.findAll()
                .stream()
                .map(CartMapper::toResponseDto)
                .collect(Collectors.toList());
    }


    @Override
    public Optional<CartResponseDto> findById(int id) {
        return cartRepository.findById(id)
                .map(CartMapper::toResponseDto);
    }

    @Override
    public List<CartResponseDto> findByUserId(int userId) {
        return cartRepository.findByUserId(userId)
                .stream()
                .map(CartMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public CartResponseDto createCart(CartDto dto) {
        User user=userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(dto.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        Cart cart=CartMapper.toEntity(dto,user,book);
        Cart saved=cartRepository.save(cart);
        return CartMapper.toResponseDto(saved);
    }

    @Override
    public CartResponseDto updateCart(int id, CartDto dto) {
        return cartRepository.findById(id).map(existing->{
            User user=userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Book book=bookRepository.findById(dto.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));
            existing.setUser(user);
            existing.setBook(book);
            existing.setUpdateAt(new Date());
            Cart updated=cartRepository.save(existing);
            return CartMapper.toResponseDto(updated);
        }).orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    @Override
    public void deleteCartById(int id) {
        cartRepository.deleteById(id);
    }

    @Override
    public void deleteCartByUserId(int userId) {
        List<Cart> carts = cartRepository.findByUserId(userId);
        if (!carts.isEmpty()) {
            cartRepository.deleteAll(carts);
        }
    }

}
