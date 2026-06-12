package com.enviro.assessment.junior.tebohothulaninyombolo.mapper;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.InvestorRegisterRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.InvestorResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.ProductResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Product;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;


@Component
public class InvestorMapper {

    public Investor toEntity(InvestorRegisterRequestDTO investorRegisterRequestDTO) {
        if (investorRegisterRequestDTO == null) return null;

        return Investor.builder()
                .firstName(investorRegisterRequestDTO.getFirstName())
                .lastName(investorRegisterRequestDTO.getLastName())
                .email(investorRegisterRequestDTO.getEmail())
                .password(investorRegisterRequestDTO.getPassword())
                .dateOfBirth(investorRegisterRequestDTO.getDateOfBirth())
                .build();
    }

    public InvestorResponseDTO toResponseDTO(Investor investor) {

        if (investor == null){
            return null;
        }

        List<ProductResponseDTO> products = investor.getProducts().stream()
                .map(this ::toResponseDTO).toList();

        BigDecimal totalBalance = investor.getProducts().stream()
                .map(Product::getBalance).reduce(BigDecimal.ZERO, BigDecimal::add);

        return InvestorResponseDTO.builder()
                .id(investor.getId())
                .firstName(investor.getFirstName())
                .lastName(investor.getLastName())
                .age(investor.getAge())
                .dateOfBirth(investor.getDateOfBirth())
                .email(investor.getEmail())
                .products(products)
                .totalBalance(totalBalance)
                .createdAt(investor.getCreatedAt())
                .build();
    }

    private ProductResponseDTO toResponseDTO(Product product) {

        if (product == null){
            return null;
        }

        return  ProductResponseDTO.builder()
                .id(product.getId())
                .productName(product.getProductName())
                .productType(product.getProductType().name())
                .balance(product.getBalance())
                .build();
    }

    public InvestorResponseDTO toResponseDTOWithToken(Investor investor, String token) {
        InvestorResponseDTO dto = toResponseDTO(investor);
        if (dto != null) {
            dto.setToken(token);
        }
        return dto;
    }

}

