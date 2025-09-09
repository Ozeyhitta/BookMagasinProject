package com.bookmagasin.entity;

import com.bookmagasin.enums.ERole;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="account")
@NoArgsConstructor
@Data
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "email",unique = true,nullable = false)
    private String email;

    @Column(name = "password",nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private ERole role;

    private boolean isActivated;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Account(String email, String password, ERole role, boolean isActivated, User user) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.isActivated = isActivated;
        this.user = user;
    }

    @Override
    public String toString() {
        return "Account{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role=" + role +
                ", isActivated=" + isActivated +
                ", user=" + user +
                '}';
    }
}
