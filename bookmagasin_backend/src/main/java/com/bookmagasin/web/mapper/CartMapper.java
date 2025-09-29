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
    public static CartResponseDto toResponseDto(Cart cart){
        CartResponseDto dto=new CartResponseDto();
        dto.setId(cart.getId());
        dto.setCreateAt(cart.getCreatedAt());
        dto.setUpdateAt(cart.getUpdateAt());
        if(cart.getUser() != null){
            UserDto userDto=new UserDto();
            userDto.setId(cart.getUser().getId());
            userDto.setFullName(cart.getUser().getFullName());
            dto.setUser(userDto);
        }
        if(cart.getBook() != null){
            BookDto bookDto=new BookDto();
            bookDto.setId(cart.getBook().getId());
            bookDto.setTitle(cart.getBook().getTitle());
            dto.setBook(bookDto);
        }
        return dto;
    }
    public static Cart toEntity(CartDto dto, User user, Book book){
        Cart cart=new Cart();
        cart.setUser(user);
        cart.setBook(book);
        cart.setCreatedAt(new Date());
        cart.setUpdateAt(new Date());
        return cart;
    }
}
