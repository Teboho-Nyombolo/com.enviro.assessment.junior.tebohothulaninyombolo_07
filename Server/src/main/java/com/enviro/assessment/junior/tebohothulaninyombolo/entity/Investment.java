package com.enviro.assessment.junior.tebohothulaninyombolo.entity;

import com.enviro.assessment.junior.tebohothulaninyombolo.enums.ProductType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "investments")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "investor_id", nullable = false)
    private Investor investor;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String productType;

    @Column(nullable = false)
    private BigDecimal initialDeposit;

    @Column(nullable = false)
    private BigDecimal currentBalance;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (currentBalance == null) {
            currentBalance = initialDeposit;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
