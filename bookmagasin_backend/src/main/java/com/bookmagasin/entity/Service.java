package com.bookmagasin.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Table(name = "service")
@NoArgsConstructor
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "name_service")
    private String nameService;
    @Column(name = "price")
    private Double price;
    @Column(name = "status")
    private Boolean status;

    @OneToMany(mappedBy = "service")
    private List<Order> orders;
}
