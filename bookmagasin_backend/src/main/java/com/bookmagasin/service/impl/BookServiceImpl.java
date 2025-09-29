package com.bookmagasin.service.impl;


import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.repository.AuthorRepository;
import com.bookmagasin.repository.BookDetailRepository;
import com.bookmagasin.repository.BookRepository;
import com.bookmagasin.service.BookService;
import com.bookmagasin.web.dto.AuthorDto;
import com.bookmagasin.web.dto.BookDetailDto;
import com.bookmagasin.web.dto.BookDto;
import com.bookmagasin.entity.Category;

import com.bookmagasin.web.dto.CategoryDto;
import com.bookmagasin.web.dtoResponse.AuthorResponseDto;
import com.bookmagasin.web.dtoResponse.BookResponseDto;
import com.bookmagasin.web.dtoResponse.CategoryResponseDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final BookDetailRepository bookDetailRepository;

    public BookServiceImpl(BookRepository bookRepository,
                           AuthorRepository authorRepository,
                           BookDetailRepository bookDetailRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.bookDetailRepository = bookDetailRepository;
    }

    // ------- Dto cơ bản ----------
    @Override
    public List<BookDto> findAll() {
        return bookRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<BookDto> findById(int id) {
        return bookRepository.findById(id).map(this::mapToDto);
    }

    @Override
    public BookDto createBook(BookDto dto) {
        Book book = new Book();
        mapToEntity(dto, book);
        return mapToDto(bookRepository.save(book));
    }

    @Override
    public BookDto updateBook(int id, BookDto dto) {
        return bookRepository.findById(id).map(existing -> {
            dto.setId(id);
            mapToEntity(dto, existing);
            return mapToDto(bookRepository.save(existing));
        }).orElseThrow(() -> new RuntimeException("Book not found"));
    }

    @Override
    public void deleteById(int id) {
        bookRepository.deleteById(id);
    }

    private BookDto mapToDto(Book book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setSellingPrice(book.getSellingPrice());
        dto.setPublicationDate(book.getPublicationDate());
        dto.setEdition(book.getEdition());
        dto.setAuthorId(book.getAuthor() != null ? book.getAuthor().getId() : 0);
        dto.setBookDetailId(book.getBookDetail() != null ? book.getBookDetail().getId() : 0);
        // map category IDs
        if (book.getCategories() != null && !book.getCategories().isEmpty()) {
            List<Integer> categoryIds = book.getCategories().stream()
                    .map(Category::getId)
                    .collect(Collectors.toList());
            dto.setCategoryIds(categoryIds);
        }
        return dto;
    }

    private void mapToEntity(BookDto dto, Book book) {
        book.setTitle(dto.getTitle());
        book.setSellingPrice(dto.getSellingPrice());
        book.setPublicationDate(dto.getPublicationDate());
        book.setEdition(dto.getEdition());

        if (dto.getAuthorId() > 0) {
            authorRepository.findById(dto.getAuthorId()).ifPresent(book::setAuthor);
        }

        if (dto.getBookDetailId() > 0) {
            bookDetailRepository.findById(dto.getBookDetailId()).ifPresent(book::setBookDetail);
        }
    }

    // -------- Dto mở rộng -----------
    @Override
    public List<BookResponseDto> findAllWithDetails() {
        return bookRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<BookResponseDto> findByIdWithDetails(int id) {
        return bookRepository.findById(id).map(this::mapToResponseDto);
    }

    @Override
    public Optional<Book> patchBookDetail(Integer id, BookDetail detailUpdates) {
        return bookRepository.findById(id).map(book -> {
            BookDetail detail = book.getBookDetail();
            if (detail != null) {
                if (detailUpdates.getPublisher() != null)
                    detail.setPublisher(detailUpdates.getPublisher());
                if (detailUpdates.getSupplier() != null)
                    detail.setSupplier(detailUpdates.getSupplier());
                if (detailUpdates.getPages() > 0)
                    detail.setPages(detailUpdates.getPages());
                if (detailUpdates.getDescription() != null)
                    detail.setDescription(detailUpdates.getDescription());
            }
            return bookRepository.save(book);
        });    }

    private BookResponseDto mapToResponseDto(Book book) {
        BookResponseDto dto = new BookResponseDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setSellingPrice(book.getSellingPrice());
        dto.setPublicationDate(book.getPublicationDate());
        dto.setEdition(book.getEdition());
        //book author
        if (book.getAuthor() != null) {
            AuthorDto authorDto=new AuthorDto();
            authorDto.setId(book.getAuthor().getId());
            authorDto.setName(book.getAuthor().getName());
            dto.setAuthor(authorDto);
        }
        //book details
        if (book.getBookDetail() != null) {
            BookDetail bd = book.getBookDetail();
            BookDetailDto detailDto = new BookDetailDto();
            detailDto.setId(bd.getId());
            detailDto.setPublisher(bd.getPublisher());
            detailDto.setSupplier(bd.getSupplier());
            detailDto.setPages(bd.getPages());
            detailDto.setDescription(bd.getDescription());
            dto.setBookDetail(detailDto);
        }
        if(book.getCategories() != null && !book.getCategories().isEmpty()){
            List<CategoryResponseDto> categoryDtos = book.getCategories()
                    .stream()
                    .map(c -> {
                        CategoryResponseDto categoryDto = new CategoryResponseDto();
                        categoryDto.setId(c.getId());
                        categoryDto.setName(c.getName());
                        if(c.getBooks() != null){
                            categoryDto.setBookIds(c.getBooks().stream().map(Book::getId).collect(Collectors.toList()));
                        }
                        return categoryDto;
                    })
                    .collect(Collectors.toList());
            dto.setCategories(categoryDtos);
        }


        return dto;
    }
}
