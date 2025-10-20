package com.bookmagasin.repository;

import com.bookmagasin.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface BookRepository extends JpaRepository<Book,Integer> {

    Optional<Book> findByTitle(String title);
    boolean existsByTitle(String title);

    List<Book> findByEdition(int edition);
    List<Book> findByAuthor(String author);

}
