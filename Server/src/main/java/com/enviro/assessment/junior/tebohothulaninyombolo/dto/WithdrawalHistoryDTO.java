package com.enviro.assessment.junior.tebohothulaninyombolo.dto;

import com.enviro.assessment.junior.tebohothulaninyombolo.enums.Status;
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
public class WithdrawalHistoryDTO {

    private Long id;
    private String productName;
    private BigDecimal amount;
    private LocalDate withdrawalDate;
    private Status status;
    private LocalDateTime createdAt;
}
