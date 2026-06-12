package com.enviro.assessment.junior.tebohothulaninyombolo.service;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.DepositRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.DepositResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Deposit;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investment;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.exception.ResourceNotFoundException;
import com.enviro.assessment.junior.tebohothulaninyombolo.mapper.DepositMapper;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.DepositRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestmentRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DepositService {

    private final DepositRepository depositRepository;
    private final InvestmentRepository investmentRepository;
    private final InvestorRepository investorRepository;
    private final DepositMapper depositMapper;

    public DepositService(DepositRepository depositRepository,
                          InvestmentRepository investmentRepository,
                          InvestorRepository investorRepository,
                          DepositMapper depositMapper) {
        this.depositRepository = depositRepository;
        this.investmentRepository = investmentRepository;
        this.investorRepository = investorRepository;
        this.depositMapper = depositMapper;
    }

    @Transactional
    public DepositResponseDTO makeDeposit(Long investorId, DepositRequestDTO request) {
        System.out.println("=== MAKING DEPOSIT ===");
        System.out.println("Investor ID: " + investorId);
        System.out.println("Investment ID: " + request.getInvestmentId());
        System.out.println("Amount: R" + request.getAmount());

        // Find investor
        Investor investor = investorRepository.findById(investorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investor not found"));

        // Find investment
        Investment investment = investmentRepository.findById(request.getInvestmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found"));

        // Verify investment belongs to investor
        if (!investment.getInvestor().getId().equals(investorId)) {
            throw new RuntimeException("Investment does not belong to this investor");
        }

        // Update investment balance
        BigDecimal newBalance = investment.getCurrentBalance().add(request.getAmount());
        investment.setCurrentBalance(newBalance);
        investmentRepository.save(investment);

        // Update investor total balance
        BigDecimal newTotalBalance = investor.getTotalBalance().add(request.getAmount());
        investor.setTotalBalance(newTotalBalance);
        investorRepository.save(investor);

        // Create deposit record using mapper
        Deposit deposit = depositMapper.toEntity(request, investor, investment);
        Deposit saved = depositRepository.save(deposit);

        System.out.println("Deposit completed. New investment balance: R" + newBalance);

        // Convert to response DTO using mapper
        return depositMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<DepositResponseDTO> getDepositHistory(Long investorId) {
        // Try both methods to see which works
        List<Deposit> deposits = depositRepository.findByInvestor_IdOrderByCreatedAtDesc(investorId);

        if (deposits.isEmpty()) {
            // Fallback to raw field if entity relationship doesn't work
            deposits = depositRepository.findByInvestor_IdOrderByCreatedAtDesc(investorId);
        }

        return depositMapper.toResponseDTOList(deposits);
    }
}