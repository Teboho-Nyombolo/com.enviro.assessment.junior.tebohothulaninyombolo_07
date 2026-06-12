package com.enviro.assessment.junior.tebohothulaninyombolo.service;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.WithdrawalHistoryDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.WithdrawalRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.WithdrawalResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investment;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Product;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Withdrawal;
import com.enviro.assessment.junior.tebohothulaninyombolo.enums.ProductType;
import com.enviro.assessment.junior.tebohothulaninyombolo.enums.Status;
import com.enviro.assessment.junior.tebohothulaninyombolo.exception.ResourceNotFoundException;
import com.enviro.assessment.junior.tebohothulaninyombolo.exception.WithdrawalValidationException;
import com.enviro.assessment.junior.tebohothulaninyombolo.mapper.WithdrawalMapper;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestmentRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestorRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.ProductRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.WithdrawalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class WithdrawalService {

    private final WithdrawalRepository withdrawalRepository;
    private final InvestmentRepository investmentRepository;
    private final InvestorRepository investorRepository;
    private final WithdrawalMapper withdrawalMapper;

    public WithdrawalService(WithdrawalRepository withdrawalRepository,
                             InvestmentRepository investmentRepository,
                             InvestorRepository investorRepository,
                             WithdrawalMapper withdrawalMapper) {
        this.withdrawalRepository = withdrawalRepository;
        this.investmentRepository = investmentRepository;
        this.investorRepository = investorRepository;
        this.withdrawalMapper = withdrawalMapper;
    }

    @Transactional
    public WithdrawalResponseDTO makeWithdrawal(Long investorId, WithdrawalRequestDTO request) {
        System.out.println("=== MAKING WITHDRAWAL ===");
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

        // Calculate max withdrawal using mapper
        BigDecimal maxWithdrawal = withdrawalMapper.calculateMaxWithdrawalAmount(investment.getCurrentBalance());

        // Validate withdrawal amount using mapper
        if (!withdrawalMapper.isValidWithdrawalAmount(request.getAmount(), investment.getCurrentBalance())) {
            throw new RuntimeException("Withdrawal amount exceeds maximum allowed (90% of balance: R" + maxWithdrawal + ")");
        }

        // Update investment balance
        BigDecimal newBalance = investment.getCurrentBalance().subtract(request.getAmount());
        investment.setCurrentBalance(newBalance);
        investmentRepository.save(investment);

        // Update investor total balance
        BigDecimal newTotalBalance = investor.getTotalBalance().subtract(request.getAmount());
        investor.setTotalBalance(newTotalBalance);
        investorRepository.save(investor);

        // Create withdrawal record using mapper
        Withdrawal withdrawal = withdrawalMapper.toEntity(request, investor, investment);
        Withdrawal saved = withdrawalRepository.save(withdrawal);

        System.out.println("Withdrawal completed. New investment balance: R" + newBalance);
        System.out.println("Max withdrawal allowed: 90% of R" + investment.getCurrentBalance());

        // Convert to response DTO using mapper
        return withdrawalMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<WithdrawalResponseDTO> getWithdrawalHistory(Long investorId) {
        List<Withdrawal> withdrawals = withdrawalRepository.findByInvestorId(investorId);
        return withdrawalMapper.toResponseDTOList(withdrawals);
    }

    @Transactional(readOnly = true)
    public WithdrawalMapper.WithdrawalSummary getWithdrawalSummary(Long investmentId) {
        Investment investment = investmentRepository.findById(investmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found"));

        return withdrawalMapper.getWithdrawalSummary(investment);
    }
}