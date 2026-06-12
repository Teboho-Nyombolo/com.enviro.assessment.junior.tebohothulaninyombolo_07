package com.enviro.assessment.junior.tebohothulaninyombolo.entity;

import com.enviro.assessment.junior.tebohothulaninyombolo.enums.ProductType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Investor ID", nullable = false)
    private Investor investor;

    @Column(name = "Product Name", nullable = false)
    private String productName;

    @Column(name = "Product Type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductType productType;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance;

    @Column(name = "max_withdrawal_amount", precision = 19, scale = 2)
    private BigDecimal maxWithdrawalAmount;

    @Column(name = "Created At")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
