package com.enviro.assessment.junior.tebohothulaninyombolo.dto.response;

import lombok.*;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ProductResponseDTO {

    private Long id;
    private String productName;
    private String productType;
    private BigDecimal balance;
    private BigDecimal maxWithdrawalAmount;
}
