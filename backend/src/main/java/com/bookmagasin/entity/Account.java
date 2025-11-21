package com.bookmagasin.entity;

import com.bookmagasin.enums.ERole;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

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


    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "account_roles",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();


    @Column(name = "is_activated")
    private boolean isActivated;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;




    @JsonProperty("activated")
    public boolean isActivated() {
        return isActivated;
    }

    public void setActivated(boolean isActivated) {
        this.isActivated = isActivated;
    }

    public Set<Role> getRoles() {
        if (roles == null) {
            roles = new HashSet<>();
        }
        return roles;
    }

    public boolean hasRole(ERole role) {
        return getRoles().stream().anyMatch(r -> r.getRole() == role);
    }

    public void addRole(Role role) {
        if (role != null) {
            getRoles().add(role);
        }
    }

    public void removeRole(ERole role) {
        if (role == null) {
            return;
        }
        getRoles().removeIf(r -> r.getRole() == role);
    }

    public ERole getPrimaryRole() {
        return getRoles().stream()
                .map(role -> role.getRole())
                .sorted((a, b) -> Integer.compare(rolePriority(a), rolePriority(b)))
                .findFirst()
                .orElse(ERole.CUSTOMER);
    }

    private int rolePriority(ERole role) {
        return switch (role) {
            case ADMIN -> 0;
            case STAFF -> 1;
            default -> 2;
        };
    }
}

