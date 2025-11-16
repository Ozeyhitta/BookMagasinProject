package com.bookmagasin.entity;

import com.bookmagasin.enums.EOrderHistory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Entity
@Table(name = "order_status_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private EOrderHistory eOrderHistory;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name ="status_change_date")
    private Date statusChangeDate;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
    

    public OrderStatusHistory(EOrderHistory eOrderHistory, Date statusChangeDate, Order order) {
        this.eOrderHistory = eOrderHistory;
        this.statusChangeDate = statusChangeDate;
        this.order = order;
    }
}
