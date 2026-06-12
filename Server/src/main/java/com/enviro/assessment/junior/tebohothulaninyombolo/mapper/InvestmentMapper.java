package com.enviro.assessment.junior.tebohothulaninyombolo.mapper;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.InvestmentRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.InvestmentResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investment;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.enums.ProductType;
import org.springframework.stereotype.Component;

@Component
public class InvestmentMapper {


    public Investment toEntity(InvestmentRequestDTO requestDTO, Investor investor) {
        if (requestDTO == null) {
            return null;
        }

        Investment investment = new Investment();
        investment.setProductName(requestDTO.getProductName());
        investment.setProductType(String.valueOf(ProductType.valueOf(requestDTO.getProductType())));
        investment.setInitialDeposit(requestDTO.getInitialDeposit());
        investment.setCurrentBalance(requestDTO.getInitialDeposit()); // Start with initial deposit
        investment.setInvestor(investor);

        return investment;
    }


    public InvestmentResponseDTO toResponseDTO(Investment investment) {
        if (investment == null) {
            return null;
        }

        InvestmentResponseDTO responseDTO = new InvestmentResponseDTO();
        responseDTO.setId(investment.getId());
        responseDTO.setProductName(investment.getProductName());
        responseDTO.setProductType(String.valueOf(investment.getProductType()));
        responseDTO.setInitialDeposit(investment.getInitialDeposit());
        responseDTO.setCurrentBalance(investment.getCurrentBalance());
        responseDTO.setCreatedAt(investment.getCreatedAt());
        responseDTO.setUpdatedAt(investment.getUpdatedAt());

        return responseDTO;
    }


    public void updateEntity(Investment existingInvestment, InvestmentRequestDTO requestDTO) {
        if (requestDTO == null || existingInvestment == null) {
            return;
        }

        if (requestDTO.getProductName() != null) {
            existingInvestment.setProductName(requestDTO.getProductName());
        }

        if (requestDTO.getProductType() != null) {
            existingInvestment.setProductType(String.valueOf(ProductType.valueOf(requestDTO.getProductType())));
        }


        if (requestDTO.getInitialDeposit() != null) {
            existingInvestment.setInitialDeposit(requestDTO.getInitialDeposit());
        }
    }
}