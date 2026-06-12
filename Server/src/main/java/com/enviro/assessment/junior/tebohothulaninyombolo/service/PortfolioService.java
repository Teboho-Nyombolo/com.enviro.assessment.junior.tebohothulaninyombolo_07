package com.enviro.assessment.junior.tebohothulaninyombolo.service;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.PortfolioResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investment;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.exception.ResourceNotFoundException;

import com.enviro.assessment.junior.tebohothulaninyombolo.mapper.PortfolioMapper;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestmentRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PortfolioService {

    private final InvestorRepository investorRepository;
    private final InvestmentRepository investmentRepository;
    private final PortfolioMapper portfolioMapper;

    public PortfolioService(InvestorRepository investorRepository,
                            InvestmentRepository investmentRepository,
                            PortfolioMapper portfolioMapper) {
        this.investorRepository = investorRepository;
        this.investmentRepository = investmentRepository;
        this.portfolioMapper = portfolioMapper;
    }

    @Transactional(readOnly = true)
    public PortfolioResponseDTO getPortfolioByInvestorId(Long investorId) {
        System.out.println("=== GETTING PORTFOLIO FOR INVESTOR: " + investorId);

        // Find investor
        Investor investor = investorRepository.findById(investorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found with ID: " + investorId));

        // Find all investments for this investor
        List<Investment> investments = investmentRepository.findByInvestorId(investorId);

        System.out.println("Found " + investments.size() + " investments");

        // Use mapper to convert to DTO
        PortfolioResponseDTO portfolio = portfolioMapper.toResponseDTO(investor, investments);

        System.out.println("Portfolio total balance: R" + portfolio.getTotalBalance());
        System.out.println("Available for withdrawal: R" + portfolio.getTotalAvailableForWithdrawal());

        return portfolio;
    }

    @Transactional(readOnly = true)
    public PortfolioResponseDTO getPortfolioByInvestorEmail(String email) {
        System.out.println("=== GETTING PORTFOLIO FOR EMAIL: " + email);

        Investor investor = investorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found with email: " + email));

        List<Investment> investments = investmentRepository.findByInvestorId(investor.getId());

        return portfolioMapper.toResponseDTO(investor, investments);
    }
}