package com.bookmagasin.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name="users")
@NoArgsConstructor
@Data
@Inheritance(strategy = InheritanceType.JOINED) //class cha ke thua
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    protected int id;
    @Column(name="full_name")
    protected String fullName;
    @Column(name = "date_of_birth")
    protected Date dateOfBirth;
    @Column(name = "gender")
    protected String gender;
    @Column(name="phone_number")
    protected String phoneNumber;
    @Column(name="address")
    protected String address;
    @Column(name="avatar_url")
    protected String avatarUrl;

    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL)
    @JsonBackReference
    private Account account;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    @JsonIgnore  // Bỏ qua trường account khi tuần tự hóa User
    private List<UserNotification> userNotifications;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Cart> carts;

    @OneToMany(mappedBy = "createBy",cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Review> reviews;

    public User(String fullName, Date dateOfBirth, String gender, String phoneNumber, String address, String avatarUrl, Account account, List<UserNotification> userNotifications, List<Review> reviews) {
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.avatarUrl = avatarUrl;
        this.account = account;
        this.userNotifications = userNotifications;
        this.reviews = reviews;
    }

    public User(String fullName, Date dateOfBirth, String gender, String phoneNumber, String address, String avatarUrl, Account account) {
    }
}
