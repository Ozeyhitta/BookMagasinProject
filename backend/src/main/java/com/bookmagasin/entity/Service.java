package com.bookmagasin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@ToString(onlyExplicitlyIncluded = true)
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
