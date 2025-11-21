package com.bookmagasin.service.impl;


import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.repository.BookDetailRepository;
import com.bookmagasin.repository.BookRepository;
import com.bookmagasin.repository.CategoryRepository;
import com.bookmagasin.service.BookService;
import com.bookmagasin.web.dto.BookDetailDto;
import com.bookmagasin.web.dto.BookDto;
import com.bookmagasin.entity.Category;

import com.bookmagasin.web.dtoResponse.BookResponseDto;
import com.bookmagasin.web.dtoResponse.CategoryResponseDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookDetailRepository bookDetailRepository;
    private final CategoryRepository categoryRepository;

    public BookServiceImpl(BookRepository bookRepository, BookDetailRepository bookDetailRepository, CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.bookDetailRepository = bookDetailRepository;
        this.categoryRepository = categoryRepository;
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
        
        // Lưu Book trước (Hibernate sẽ tự động cascade lưu BookDetail nếu có CascadeType.ALL)
        Book savedBook = bookRepository.save(book);
        return mapToDto(savedBook);
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
        dto.setCode(book.getCode());
        dto.setSellingPrice(book.getSellingPrice());
        dto.setStockQuantity(book.getStockQuantity());
        dto.setPublicationDate(book.getPublicationDate());
        dto.setEdition(book.getEdition());
        dto.setAuthor(book.getAuthor());
        if (book.getBookDetail() != null) {
            dto.setBookDetailId(book.getBookDetail().getId());
            dto.setBookDetail(mapDetailToDto(book.getBookDetail()));
        }
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
        book.setCode(dto.getCode());
        book.setSellingPrice(dto.getSellingPrice());
        book.setStockQuantity(dto.getStockQuantity());
        book.setPublicationDate(dto.getPublicationDate());
        book.setEdition(dto.getEdition());
        book.setAuthor(dto.getAuthor());

        // BookDetail - Không lưu riêng, để Hibernate cascade tự động xử lý
        if (dto.getBookDetail() != null) {
            BookDetail detail = resolveBookDetailEntity(dto, book);
            applyDetail(dto.getBookDetail(), detail);
            // KHÔNG set detail.setBook(book) và KHÔNG lưu detail riêng ở đây
            // Chỉ set vào book, khi lưu book với CascadeType.ALL, Hibernate sẽ tự động lưu detail
            book.setBookDetail(detail);
        } else if (dto.getBookDetailId() > 0) {
            bookDetailRepository.findById(dto.getBookDetailId())
                    .ifPresent(book::setBookDetail);
        }

        // ✅ Map Category IDs
        if (dto.getCategoryIds() != null && !dto.getCategoryIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(dto.getCategoryIds());
            book.setCategories(categories);
            // ✅ Đồng bộ cả chiều ManyToMany nếu muốn
            categories.forEach(c -> {
                if (!c.getBooks().contains(book)) {
                    c.getBooks().add(book);
                }
            });
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

    @Override
    public boolean updateBookCategories(int bookId, List<Integer> categoryIds) {
        Optional<Book> optionalBook = bookRepository.findById(bookId);
        if (optionalBook.isEmpty()) {
            return false;
        }

        Book book = optionalBook.get();

        // Lấy categories từ DB theo list ID
        List<Category> categories = categoryRepository.findAllById(categoryIds);

        // Set vào Book
        book.setCategories(categories);

        // Đồng bộ hai chiều để tránh lỗi JPA
        categories.forEach(c -> {
            if (!c.getBooks().contains(book)) {
                c.getBooks().add(book);
            }
        });

        bookRepository.save(book);
        return true;
    }

    private BookDetailDto mapDetailToDto(BookDetail detail) {
        if (detail == null) {
            return null;
        }
        BookDetailDto detailDto = new BookDetailDto();
        detailDto.setId(detail.getId());
        detailDto.setPublisher(detail.getPublisher());
        detailDto.setSupplier(detail.getSupplier());
        detailDto.setLength(detail.getLength());
        detailDto.setWidth(detail.getWidth());
        detailDto.setHeight(detail.getHeight());
        detailDto.setWeight(detail.getWeight());
        detailDto.setPages(detail.getPages());
        detailDto.setDescription(detail.getDescription());
        detailDto.setImageUrl(detail.getImageUrl());
        return detailDto;
    }

    private BookDetail resolveBookDetailEntity(BookDto dto, Book book) {
        BookDetail currentDetail = book.getBookDetail();
        int requestedDetailId = dto.getBookDetail().getId();

        if (requestedDetailId > 0) {
            return bookDetailRepository.findById(requestedDetailId)
                    .orElseGet(() -> currentDetail != null ? currentDetail : new BookDetail());
        }

        return currentDetail != null ? currentDetail : new BookDetail();
    }

    private void applyDetail(BookDetailDto detailDto, BookDetail detail) {
        detail.setPublisher(detailDto.getPublisher());
        detail.setSupplier(detailDto.getSupplier());
        detail.setLength(detailDto.getLength());
        detail.setWidth(detailDto.getWidth());
        detail.setHeight(detailDto.getHeight());
        detail.setWeight(detailDto.getWeight());
        detail.setPages(detailDto.getPages());
        detail.setDescription(detailDto.getDescription());
        detail.setImageUrl(detailDto.getImageUrl());
    }


    private BookResponseDto mapToResponseDto(Book book) {
        BookResponseDto dto = new BookResponseDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setCode(book.getCode());
        dto.setSellingPrice(book.getSellingPrice());
        dto.setStockQuantity(book.getStockQuantity());
        dto.setPublicationDate(book.getPublicationDate());
        dto.setEdition(book.getEdition());
        dto.setAuthor(book.getAuthor());

        // ✅ Thêm đầy đủ thuộc tính BookDetail
        if (book.getBookDetail() != null) {
            dto.setBookDetail(mapDetailToDto(book.getBookDetail()));
        }

        // ✅ Map categories
        if (book.getCategories() != null && !book.getCategories().isEmpty()) {
            List<CategoryResponseDto> categoryDtos = book.getCategories()
                    .stream()
                    .map(c -> {
                        CategoryResponseDto categoryDto = new CategoryResponseDto();
                        categoryDto.setId(c.getId());
                        categoryDto.setName(c.getName());
                        if (c.getBooks() != null) {
                            categoryDto.setBookIds(c.getBooks()
                                    .stream()
                                    .map(Book::getId)
                                    .collect(Collectors.toList()));
                        }
                        return categoryDto;
                    })
                    .collect(Collectors.toList());
            dto.setCategories(categoryDtos);
        }

        return dto;
    }

}
