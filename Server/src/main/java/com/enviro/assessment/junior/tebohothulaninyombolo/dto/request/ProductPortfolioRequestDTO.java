package com.enviro.assessment.junior.tebohothulaninyombolo.dto.request;


import com.enviro.assessment.junior.tebohothulaninyombolo.enums.ProductType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPortfolioRequestDTO {

    private Long productId;
    private String productName;
    private ProductType productType;
    private BigDecimal currentBalance;
    private BigDecimal initialDeposit;
    private BigDecimal availableForWithdrawal;
    private BigDecimal maxWithdrawalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}