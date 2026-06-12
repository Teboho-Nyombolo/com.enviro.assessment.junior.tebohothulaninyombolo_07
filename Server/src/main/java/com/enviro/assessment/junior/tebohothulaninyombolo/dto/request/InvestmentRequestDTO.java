package com.enviro.assessment.junior.tebohothulaninyombolo.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestmentRequestDTO {

    @NotBlank(message = "Product name is required")
    private String productName;

    @NotBlank(message = "Product type is required")
    private String productType;

    @NotNull(message = "Initial deposit is required")
    @DecimalMin(value = "0.01", message = "Initial deposit must be at least R0.01")
    private BigDecimal initialDeposit;
}
