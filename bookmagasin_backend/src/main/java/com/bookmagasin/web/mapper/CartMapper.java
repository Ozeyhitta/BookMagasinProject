package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.Cart;
import com.bookmagasin.entity.User;
import com.bookmagasin.web.dto.BookDto;
import com.bookmagasin.web.dto.CartDto;
import com.bookmagasin.web.dto.UserDto;
import com.bookmagasin.web.dtoResponse.CartResponseDto;

import java.util.Date;

public class CartMapper {

    // Convert Entity -> DTO (for frontend)
    public static CartResponseDto toResponseDto(Cart cart) {
        if (cart == null) return null;

        CartResponseDto dto = new CartResponseDto();
        dto.setId(cart.getId());
        dto.setCreateAt(cart.getCreatedAt());
        dto.setUpdateAt(cart.getUpdateAt());
        dto.setQuantity(cart.getQuantity());  // nếu có field này trong Cart

        // Map user
        User user = cart.getUser();
        if (user != null) {
            UserDto ud = new UserDto();
            ud.setId(user.getId());
            ud.setFullName(user.getFullName());
            dto.setUser(ud);
        }

        // Map book
        Book book = cart.getBook();
        if (book != null) {
            BookDto bd = new BookDto();
            bd.setId(book.getId());
            bd.setTitle(book.getTitle());
            bd.setSellingPrice(book.getSellingPrice());
            bd.setAuthor(book.getAuthor());

            if (book.getBookDetail() != null) {
                bd.setImageUrl(book.getBookDetail().getImageUrl());
            }

            dto.setBook(bd);
        }

        return dto;
    }

    // Convert DTO -> Entity (for create/update)
    public static Cart toEntity(CartDto dto, User user, Book book) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setBook(book);
        cart.setQuantity(dto.getQuantity());   // quantity
        cart.setCreatedAt(new Date());
        cart.setUpdateAt(new Date());

        return cart;
    }

    // Copy fields for update (optional)
    public static void updateEntity(Cart cart, CartDto dto, Book book) {
        cart.setBook(book);
        cart.setQuantity(dto.getQuantity());
        cart.setUpdateAt(new Date());
    }
}