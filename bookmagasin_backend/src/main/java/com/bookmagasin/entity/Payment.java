package com.bookmagasin.entity;

import com.bookmagasin.enums.EMethod;
import com.bookmagasin.enums.EStatusPayment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private Double amount;

    @Enumerated(EnumType.STRING)
    private EMethod method;

    @Enumerated(EnumType.STRING)
    private EStatusPayment paymentStatus;

    @OneToOne(mappedBy = "payment")
    private Order order;
}
