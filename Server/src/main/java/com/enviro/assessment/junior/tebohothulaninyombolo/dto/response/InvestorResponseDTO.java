package com.enviro.assessment.junior.tebohothulaninyombolo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestorResponseDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private Integer age;
    private List<ProductResponseDTO> products;
    private BigDecimal totalBalance;
    private LocalDateTime createdAt;
    private String token;
    private LocalDateTime updatedAt;
}
