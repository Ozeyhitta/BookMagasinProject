package com.bookmagasin.entity;

import com.bookmagasin.enums.ERole;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="account")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private ERole role;


    @Column(name = "is_activated")
    private boolean isActivated;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonManagedReference
    private User user;

    @JsonProperty("activated")
    public boolean isActivated() {
        return isActivated;
    }

    public void setActivated(boolean isActivated) {
        this.isActivated = isActivated;
    }

    // Đảm bảo setter được gọi khi tạo mới hoặc cập nhật tài khoản
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

