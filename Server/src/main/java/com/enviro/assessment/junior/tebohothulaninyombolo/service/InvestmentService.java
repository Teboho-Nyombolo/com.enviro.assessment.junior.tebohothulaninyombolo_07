package com.enviro.assessment.junior.tebohothulaninyombolo.service;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.InvestmentRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.InvestmentResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investment;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.exception.WithdrawalValidationException;
import com.enviro.assessment.junior.tebohothulaninyombolo.mapper.InvestmentMapper;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestmentRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvestmentService {

    private final InvestmentRepository investmentRepository;
    private final InvestorRepository investorRepository;
    private final InvestmentMapper investmentMapper;

    public InvestmentService(InvestmentRepository investmentRepository,
                             InvestorRepository investorRepository,
                             InvestmentMapper investmentMapper) {
        this.investmentRepository = investmentRepository;
        this.investorRepository = investorRepository;
        this.investmentMapper = investmentMapper;
    }

    @Transactional
    public InvestmentResponseDTO createInvestment(Long investorId, InvestmentRequestDTO request) {
        System.out.println("=== CREATING INVESTMENT ===");
        System.out.println("Investor ID: " + investorId);
        System.out.println("Product Name: " + request.getProductName());
        System.out.println("Initial Deposit: R" + request.getInitialDeposit());

        // Find investor
        Investor investor = investorRepository.findById(investorId)
                .orElseThrow(() -> new WithdrawalValidationException("Investor not found with ID: " + investorId));

        // Create investment entity using mapper
        Investment investment = investmentMapper.toEntity(request, investor);

        // Update investor's total balance
        BigDecimal currentTotal = investor.getTotalBalance() != null ? investor.getTotalBalance() : BigDecimal.ZERO;
        BigDecimal newTotal = currentTotal.add(request.getInitialDeposit());
        investor.setTotalBalance(newTotal);
        investorRepository.save(investor);

        System.out.println("Updated investor balance: R" + newTotal);

        // Save investment
        Investment saved = investmentRepository.save(investment);
        System.out.println("Investment saved with ID: " + saved.getId());

        // Convert to response DTO
        return investmentMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<InvestmentResponseDTO> getInvestmentsByInvestor(Long investorId) {
        System.out.println("=== GETTING INVESTMENTS FOR INVESTOR: " + investorId);

        List<Investment> investments = investmentRepository.findByInvestorId(investorId);

        return investments.stream()
                .map(investmentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InvestmentResponseDTO getInvestmentById(Long id) {
        System.out.println("=== GETTING INVESTMENT BY ID: " + id);

        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new WithdrawalValidationException("Investment not found with ID: " + id));

        return investmentMapper.toResponseDTO(investment);
    }

    @Transactional
    public InvestmentResponseDTO updateInvestment(Long id, InvestmentRequestDTO request) {
        System.out.println("=== UPDATING INVESTMENT: " + id);

        Investment existingInvestment = investmentRepository.findById(id)
                .orElseThrow(() -> new WithdrawalValidationException("Investment not found with ID: " + id));

        // Update entity using mapper
        investmentMapper.updateEntity(existingInvestment, request);

        Investment updated = investmentRepository.save(existingInvestment);
        System.out.println("Investment updated successfully");

        return investmentMapper.toResponseDTO(updated);
    }

    @Transactional
    public void deleteInvestment(Long id) {
        System.out.println("=== DELETING INVESTMENT: " + id);

        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new WithdrawalValidationException("Investment not found with ID: " + id));

        // Remove investment amount from investor's total balance
        Investor investor = investment.getInvestor();
        BigDecimal currentTotal = investor.getTotalBalance() != null ? investor.getTotalBalance() : BigDecimal.ZERO;
        BigDecimal newTotal = currentTotal.subtract(investment.getCurrentBalance());
        investor.setTotalBalance(newTotal);
        investorRepository.save(investor);

        investmentRepository.delete(investment);
        System.out.println("Investment deleted successfully");
    }
}
