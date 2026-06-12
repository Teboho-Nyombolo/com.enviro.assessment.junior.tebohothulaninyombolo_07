package com.enviro.assessment.junior.tebohothulaninyombolo.mapper;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.WithdrawalHistoryDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.WithdrawalRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.WithdrawalResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investment;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Withdrawal;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import static com.enviro.assessment.junior.tebohothulaninyombolo.enums.Status.COMPLETED;

@Component
public class WithdrawalMapper {

    private static final BigDecimal WITHDRAWAL_PERCENTAGE = new BigDecimal("0.90"); // 90%

    /**
     * Convert DTO to Entity
     */
    public Withdrawal toEntity(WithdrawalRequestDTO requestDTO, Investor investor, Investment investment) {
        if (requestDTO == null) {
            return null;
        }

        Withdrawal withdrawal = new Withdrawal();
        withdrawal.setInvestor(investor);
        withdrawal.setInvestment(investment);
        withdrawal.setAmount(requestDTO.getAmount());
        withdrawal.setStatus(COMPLETED);

        return withdrawal;
    }

    /**
     * Convert Entity to Response DTO
     */
    public WithdrawalResponseDTO toResponseDTO(Withdrawal withdrawal) {
        if (withdrawal == null) {
            return null;
        }

        return WithdrawalResponseDTO.builder()
                .id(withdrawal.getId())
                .investmentId(withdrawal.getInvestment() != null ? withdrawal.getInvestment().getId() : null)
                .investmentName(withdrawal.getInvestment() != null ? withdrawal.getInvestment().getProductName() : null)
                .amount(withdrawal.getAmount())
                .withdrawalDate(withdrawal.getWithdrawalDate())
                .status(withdrawal.getStatus().name())
                .reference(withdrawal.getReference())
                .maxWithdrawalAmount(calculateMaxWithdrawal(withdrawal.getInvestment()))
                .withdrawalPercentage(WITHDRAWAL_PERCENTAGE)
                .remainingBalance(withdrawal.getInvestment() != null ?
                        withdrawal.getInvestment().getCurrentBalance() : BigDecimal.ZERO)
                .build();
    }

    /**
     * Convert list of Entities to list of Response DTOs
     */
    public List<WithdrawalResponseDTO> toResponseDTOList(List<Withdrawal> withdrawals) {
        if (withdrawals == null || withdrawals.isEmpty()) {
            return List.of();
        }

        return withdrawals.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update existing entity from DTO
     */
    public void updateEntity(Withdrawal existingWithdrawal, WithdrawalRequestDTO requestDTO) {
        if (existingWithdrawal == null || requestDTO == null) {
            return;
        }

        if (requestDTO.getAmount() != null) {
            existingWithdrawal.setAmount(requestDTO.getAmount());
        }
    }

    /**
     * Validate withdrawal amount (max 90% of current balance)
     */
    public boolean isValidWithdrawalAmount(BigDecimal withdrawalAmount, BigDecimal currentBalance) {
        if (withdrawalAmount == null || currentBalance == null) {
            return false;
        }

        BigDecimal maxWithdrawal = calculateMaxWithdrawalAmount(currentBalance);
        return withdrawalAmount.compareTo(maxWithdrawal) <= 0 && withdrawalAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Calculate max withdrawal amount (90% of current balance)
     */
    public BigDecimal calculateMaxWithdrawalAmount(BigDecimal currentBalance) {
        if (currentBalance == null) {
            return BigDecimal.ZERO;
        }

        return currentBalance.multiply(WITHDRAWAL_PERCENTAGE)
                .setScale(2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Calculate max withdrawal for an investment
     */
    public BigDecimal calculateMaxWithdrawal(Investment investment) {
        if (investment == null || investment.getCurrentBalance() == null) {
            return BigDecimal.ZERO;
        }

        return calculateMaxWithdrawalAmount(investment.getCurrentBalance());
    }

    /**
     * Get withdrawal summary for an investment
     */
    public WithdrawalSummary getWithdrawalSummary(Investment investment) {
        if (investment == null) {
            return new WithdrawalSummary(BigDecimal.ZERO, BigDecimal.ZERO, WITHDRAWAL_PERCENTAGE);
        }

        BigDecimal maxWithdrawal = calculateMaxWithdrawalAmount(investment.getCurrentBalance());
        BigDecimal remainingAfterWithdrawal = investment.getCurrentBalance().subtract(maxWithdrawal);

        return new WithdrawalSummary(
                investment.getCurrentBalance(),
                maxWithdrawal,
                remainingAfterWithdrawal,
                WITHDRAWAL_PERCENTAGE
        );
    }

    /**
     * Inner class for withdrawal summary
     */
    public static class WithdrawalSummary {
        private final BigDecimal currentBalance;
        private final BigDecimal maxWithdrawalAmount;
        private final BigDecimal remainingAfterWithdrawal;
        private final BigDecimal withdrawalPercentage;

        public WithdrawalSummary(BigDecimal currentBalance, BigDecimal maxWithdrawalAmount,
                                 BigDecimal withdrawalPercentage) {
            this.currentBalance = currentBalance;
            this.maxWithdrawalAmount = maxWithdrawalAmount;
            this.remainingAfterWithdrawal = currentBalance.subtract(maxWithdrawalAmount);
            this.withdrawalPercentage = withdrawalPercentage;
        }

        public WithdrawalSummary(BigDecimal currentBalance, BigDecimal maxWithdrawalAmount,
                                 BigDecimal remainingAfterWithdrawal, BigDecimal withdrawalPercentage) {
            this.currentBalance = currentBalance;
            this.maxWithdrawalAmount = maxWithdrawalAmount;
            this.remainingAfterWithdrawal = remainingAfterWithdrawal;
            this.withdrawalPercentage = withdrawalPercentage;
        }

        public BigDecimal getCurrentBalance() { return currentBalance; }
        public BigDecimal getMaxWithdrawalAmount() { return maxWithdrawalAmount; }
        public BigDecimal getRemainingAfterWithdrawal() { return remainingAfterWithdrawal; }
        public BigDecimal getWithdrawalPercentage() { return withdrawalPercentage; }
    }
}