package com.enviro.assessment.junior.tebohothulaninyombolo.entity;

import com.enviro.assessment.junior.tebohothulaninyombolo.enums.ProductType;
import com.enviro.assessment.junior.tebohothulaninyombolo.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "deposits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deposit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investor_id", nullable = false)
    private Investor investor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investment_id", nullable = false)
    private Investment investment;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductType product;


    @Column(nullable = false)
    private LocalDateTime depositDate;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    @Column(nullable = false)
    private Status status ;

    @Column(name = "Created At")
    private LocalDateTime createdAt;

    private String reference;

    @PrePersist
    protected void onCreate() {
        this.transactionDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        depositDate = LocalDateTime.now();
        if (reference == null) {
            reference = "DEP_" + System.currentTimeMillis();
        }
    }

}