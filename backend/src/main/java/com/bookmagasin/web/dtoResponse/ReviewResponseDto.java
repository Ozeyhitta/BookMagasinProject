package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.web.dto.BookDto;
import com.bookmagasin.web.dto.UserDto;

import java.util.Date;

public class ReviewResponseDto {
    private int id;
    private int rate;
    private String content;
    private Date createAt;
    private BookDto book;     // có thể chỉ bao gồm id + title
    private UserDto createBy; // chỉ id + fullName

    public ReviewResponseDto() {
    }

    public ReviewResponseDto(int id, int rate, String content,
                             Date createAt, BookDto book, UserDto createBy) {
        this.id = id;
        this.rate = rate;
        this.content = content;
        this.createAt = createAt;
        this.book = book;
        this.createBy = createBy;
    }

    // ====== getter / setter ======
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getRate() {
        return rate;
    }

    public void setRate(int rate) {
        this.rate = rate;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Date createAt) {
        this.createAt = createAt;
    }

    public BookDto getBook() {
        return book;
    }

    public void setBook(BookDto book) {
        this.book = book;
    }

    public UserDto getCreateBy() {
        return createBy;
    }

    public void setCreateBy(UserDto createBy) {
        this.createBy = createBy;
    }
}
