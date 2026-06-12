package com.enviro.assessment.junior.tebohothulaninyombolo.dto.response;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.ProductPortfolioRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioResponseDTO {

    private Long investorId;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private Integer age;
    private List<ProductPortfolioRequestDTO> products;
    private BigDecimal totalBalance;
    private BigDecimal totalAvailableForWithdrawal;
}