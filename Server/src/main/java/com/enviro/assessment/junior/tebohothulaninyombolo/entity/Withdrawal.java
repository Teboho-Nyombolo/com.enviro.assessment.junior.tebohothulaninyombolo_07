package com.enviro.assessment.junior.tebohothulaninyombolo.entity;

import com.enviro.assessment.junior.tebohothulaninyombolo.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "withdrawal notices")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Withdrawal {


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

    @Column(nullable = false)
    private LocalDateTime withdrawalDate;

    @Column(nullable = false)
    private Status status ;

    @Column(name = "Created At")
    private LocalDateTime createdAt;

    private String reference;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        withdrawalDate = LocalDateTime.now();
        if (reference == null) {
            reference = "WTH_" + System.currentTimeMillis();
        }
    }
}
