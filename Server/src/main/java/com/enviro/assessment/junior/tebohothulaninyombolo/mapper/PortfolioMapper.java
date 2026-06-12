package com.enviro.assessment.junior.tebohothulaninyombolo.mapper;


import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.ProductPortfolioRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.ProductRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.PortfolioResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investment;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.enums.ProductType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PortfolioMapper {

    private static final BigDecimal WITHDRAWAL_PERCENTAGE = new BigDecimal("0.90"); // 90%


    public PortfolioResponseDTO toResponseDTO(Investor investor, List<Investment> investments) {
        if (investor == null) {
            return null;
        }

        PortfolioResponseDTO portfolio = PortfolioResponseDTO.builder()
                .investorId(investor.getId())
                .firstName(investor.getFirstName())
                .lastName(investor.getLastName())
                .email(investor.getEmail())
                .dateOfBirth(investor.getDateOfBirth())
                .age(calculateAge(investor.getDateOfBirth()))
                .products(convertToProductPortfolioDTOs(investments))
                .totalBalance(calculateTotalBalance(investments))
                .totalAvailableForWithdrawal(calculateAvailableForWithdrawal(calculateTotalBalance(investments)))
                .build();

        return portfolio;
    }


    public List<ProductPortfolioRequestDTO> convertToProductPortfolioDTOs(List<Investment> investments) {
        if (investments == null || investments.isEmpty()) {
            return List.of();
        }

        return investments.stream()
                .map(this::toProductPortfolioDTO)
                .collect(Collectors.toList());
    }


    public ProductPortfolioRequestDTO toProductPortfolioDTO(Investment investment) {
        if (investment == null) {
            return null;
        }

        return ProductPortfolioRequestDTO.builder()
                .productId(investment.getId())
                .productName(investment.getProductName())
                .productType(investment.getProductType() != null ?
                        ProductType.valueOf(investment.getProductType()) : null)
                .currentBalance(investment.getCurrentBalance())
                .initialDeposit(investment.getInitialDeposit())
                .availableForWithdrawal(calculateMaxWithdrawal(investment.getCurrentBalance()))
                .maxWithdrawalAmount(calculateMaxWithdrawal(investment.getCurrentBalance()))
                .createdAt(investment.getCreatedAt())
                .updatedAt(investment.getUpdatedAt())
                .build();
    }

    public ProductRequestDTO toProductRequestDTO(Investment investment) {
        if (investment == null) {
            return null;
        }

        return ProductRequestDTO.builder()
                .investorId(investment.getInvestor() != null ? investment.getInvestor().getId() : null)
                .productName(investment.getProductName())
                .productType(investment.getProductType() != null ?
                        ProductType.valueOf(investment.getProductType()) : null)
                .build();
    }

  
    public void updatePortfolioDTO(PortfolioResponseDTO existingDTO, Investor investor, List<Investment> investments) {
        if (existingDTO == null) {
            return;
        }

        // Update financial data
        BigDecimal totalBalance = calculateTotalBalance(investments);
        existingDTO.setTotalBalance(totalBalance);
        existingDTO.setTotalAvailableForWithdrawal(calculateAvailableForWithdrawal(totalBalance));

        // Update products
        List<ProductPortfolioRequestDTO> products = convertToProductPortfolioDTOs(investments);
        existingDTO.setProducts(products);

        // Update investor info if changed
        if (investor != null) {
            existingDTO.setFirstName(investor.getFirstName());
            existingDTO.setLastName(investor.getLastName());
            existingDTO.setEmail(investor.getEmail());
            existingDTO.setDateOfBirth(investor.getDateOfBirth());
            existingDTO.setAge(calculateAge(investor.getDateOfBirth()));
        }
    }

    // Private helper methods

    private Integer calculateAge(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            return null;
        }

        LocalDate currentDate = LocalDate.now();
        return Period.between(dateOfBirth, currentDate).getYears();
    }

    private BigDecimal calculateTotalBalance(List<Investment> investments) {
        if (investments == null || investments.isEmpty()) {
            return BigDecimal.ZERO;
        }

        return investments.stream()
                .map(Investment::getCurrentBalance)
                .filter(balance -> balance != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateAvailableForWithdrawal(BigDecimal totalBalance) {
        if (totalBalance == null) {
            return BigDecimal.ZERO;
        }

        return totalBalance.multiply(WITHDRAWAL_PERCENTAGE)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateMaxWithdrawal(BigDecimal balance) {
        if (balance == null) {
            return BigDecimal.ZERO;
        }

        return balance.multiply(WITHDRAWAL_PERCENTAGE)
                .setScale(2, RoundingMode.HALF_UP);
    }
}