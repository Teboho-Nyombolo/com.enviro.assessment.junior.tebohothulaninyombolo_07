package com.enviro.assessment.junior.tebohothulaninyombolo.dto.response;

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
public class DepositResponseDTO {

    private Long id;
    private Long investmentId;
    private String investmentName;
    private BigDecimal amount;
    private LocalDateTime depositDate;
    private String status;
    private String reference;
}
