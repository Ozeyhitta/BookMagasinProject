package com.bookmagasin.entity;

import com.bookmagasin.enums.ERole;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="account")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    @EqualsAndHashCode.Include
    private int id;

    @Column(name = "email", unique = true, nullable = false)
    @ToString.Include
    private String email;


    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
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

    // Helper methods để làm việc với role
    public boolean hasRole(ERole role) {
        return this.role == role;
    }

    public void addRole(ERole role) {
        this.role = role;
    }

    public void removeRole(ERole role) {
        if (this.role == role) {
            this.role = ERole.CUSTOMER; // Mặc định về CUSTOMER
        }
    }
}

