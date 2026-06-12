package com.enviro.assessment.junior.tebohothulaninyombolo.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WithdrawalRequestDTO {
    @NotNull(message = "Investment ID is required")
    private Long investmentId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be at least R0.01")
    private BigDecimal amount;
}
