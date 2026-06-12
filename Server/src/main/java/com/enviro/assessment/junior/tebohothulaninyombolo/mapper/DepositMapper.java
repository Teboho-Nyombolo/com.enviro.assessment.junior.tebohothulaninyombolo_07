package com.enviro.assessment.junior.tebohothulaninyombolo.mapper;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.DepositRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.DepositResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Deposit;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investment;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.enums.ProductType;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.enviro.assessment.junior.tebohothulaninyombolo.enums.Status.COMPLETED;

@Component
public class DepositMapper {


    public Deposit toEntity(DepositRequestDTO requestDTO, Investor investor, Investment investment) {
        if (requestDTO == null) {
            return null;
        }

        Deposit deposit = new Deposit();
        deposit.setInvestor(investor);
        deposit.setInvestment(investment);
        deposit.setAmount(requestDTO.getAmount());
        deposit.setProduct(ProductType.valueOf(investment.getProductType()));
        deposit.setStatus(COMPLETED);
        deposit.setDepositDate(LocalDateTime.now());
        deposit.setReference(generateReference());
        deposit.setCreatedAt(LocalDateTime.now());

        return deposit;
    }


    private String generateReference() {
        return "DEP-" + System.currentTimeMillis();
    }

    public DepositResponseDTO toResponseDTO(Deposit deposit) {
        if (deposit == null) {
            return null;
        }

        return DepositResponseDTO.builder()
                .id(deposit.getId())
                .investmentId(deposit.getInvestment() != null ? deposit.getInvestment().getId() : null)
                .investmentName(deposit.getInvestment() != null ? deposit.getInvestment().getProductName() : null)
                .amount(deposit.getAmount())
                .depositDate(deposit.getDepositDate())
                .status(deposit.getStatus().name())
                .reference(deposit.getReference())
                .build();
    }


    public List<DepositResponseDTO> toResponseDTOList(List<Deposit> deposits) {
        if (deposits == null || deposits.isEmpty()) {
            return List.of();
        }

        return deposits.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }


    public void updateEntity(Deposit existingDeposit, DepositRequestDTO requestDTO) {
        if (existingDeposit == null || requestDTO == null) {
            return;
        }

        if (requestDTO.getAmount() != null) {
            existingDeposit.setAmount(requestDTO.getAmount());
        }
    }
}
