package com.bookmagasin.entity;

import com.bookmagasin.enums.RequestStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "staff_request")
@Data
@NoArgsConstructor
public class StaffRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "position")
    private String position;

    @Column(name = "join_date")
    @Temporal(TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date joinDate;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;
}
