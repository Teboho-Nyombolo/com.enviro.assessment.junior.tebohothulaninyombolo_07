package com.enviro.assessment.junior.tebohothulaninyombolo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WithdrawalResponseDTO {

    private Long id;
    private Long investmentId;
    private String investmentName;
    private BigDecimal amount;
    private LocalDateTime withdrawalDate;
    private String status;
    private String reference;
    private BigDecimal maxWithdrawalAmount;
    private BigDecimal withdrawalPercentage;
    private BigDecimal remainingBalance;
}
