package com.bookmagasin.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "staff")
@Data
@NoArgsConstructor
public class Staff extends User {
    // KHÔNG cần thêm field position/hireDate vì User đã có:
    // private String position;
    // private Date joinDate;
}
