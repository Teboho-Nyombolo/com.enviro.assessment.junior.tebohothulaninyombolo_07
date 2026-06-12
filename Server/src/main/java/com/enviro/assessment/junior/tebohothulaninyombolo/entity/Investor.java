package com.enviro.assessment.junior.tebohothulaninyombolo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "investors")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Investor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "First Name", nullable = false)
    private String firstName;

    @Column(name = "Last Name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;


    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "auth_token")
    private String authToken;


    @Column(name = "Date Of Birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "Age", nullable = false)
    private Integer age;


    @Column(name = "balance", nullable = false)
    private BigDecimal totalBalance = BigDecimal.ZERO;

    @Column(name = "Created At")
    private LocalDateTime createdAt;

    @Column(name = "Updated At")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "investor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Product> products = new ArrayList<>();

    @OneToMany(mappedBy = "investor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Withdrawal> withdrawalNotices = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (totalBalance == null) {
            totalBalance = BigDecimal.ZERO;
        }

        if (age == null && dateOfBirth != null) {
            age = LocalDate.now().getYear() - dateOfBirth.getYear();

            // Adjust if birthday hasn't occurred yet this year

            if (LocalDate.now().getDayOfYear() < dateOfBirth.getDayOfYear()) {
                age--;
            }
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
