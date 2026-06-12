package com.enviro.assessment.junior.tebohothulaninyombolo.service.Tests;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.WithdrawalHistoryDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.WithdrawalRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.WithdrawalResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investment;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Product;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Withdrawal;
import com.enviro.assessment.junior.tebohothulaninyombolo.enums.ProductType;
import com.enviro.assessment.junior.tebohothulaninyombolo.exception.ResourceNotFoundException;
import com.enviro.assessment.junior.tebohothulaninyombolo.exception.WithdrawalValidationException;
import com.enviro.assessment.junior.tebohothulaninyombolo.mapper.WithdrawalMapper;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestmentRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestorRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.ProductRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.WithdrawalRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.service.WithdrawalService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.enviro.assessment.junior.tebohothulaninyombolo.enums.Status.COMPLETED;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WithdrawalServiceTest {

    @Mock
    private InvestorRepository investorRepository;

    @Mock
    private InvestmentRepository investmentRepository;

    @Mock
    private WithdrawalRepository withdrawalRepository;

    @Mock
    private WithdrawalMapper withdrawalMapper;

    @InjectMocks
    private WithdrawalService withdrawalService;

    private Investor investor;
    private Investment investment;
    private WithdrawalRequestDTO request;

    @BeforeEach
    void setUp() {
        investor = new Investor();
        investor.setId(1L);
        investor.setFirstName("John");
        investor.setLastName("Doe");
        investor.setDateOfBirth(LocalDate.of(1960, 1, 1)); // Age ~65
        investor.setTotalBalance(new BigDecimal("100000.00"));

        investment = new Investment();
        investment.setId(1L);
        investment.setInvestor(investor);
        investment.setProductName("Retirement Fund");
        investment.setProductType("RETIREMENT");
        investment.setCurrentBalance(new BigDecimal("100000.00"));
        investment.setInitialDeposit(new BigDecimal("100000.00"));

        request = new WithdrawalRequestDTO();
        request.setInvestmentId(1L);
        request.setAmount(new BigDecimal("5000.00"));
    }

    @Test
    void createWithdrawal_Success() {
        // Given
        when(investorRepository.findById(1L)).thenReturn(Optional.of(investor));
        when(investmentRepository.findById(1L)).thenReturn(Optional.of(investment));
        when(investmentRepository.save(any(Investment.class))).thenReturn(investment);
        when(investorRepository.save(any(Investor.class))).thenReturn(investor);

        Withdrawal savedWithdrawal = new Withdrawal();
        savedWithdrawal.setId(1L);
        savedWithdrawal.setInvestor(investor);
        savedWithdrawal.setInvestment(investment);
        savedWithdrawal.setAmount(new BigDecimal("5000.00"));
        savedWithdrawal.setStatus(COMPLETED);
        savedWithdrawal.setWithdrawalDate(LocalDateTime.now());

        when(withdrawalRepository.save(any(Withdrawal.class))).thenReturn(savedWithdrawal);

        WithdrawalResponseDTO expectedResponse = WithdrawalResponseDTO.builder()
                .id(1L)
                .investmentId(1L)
                .investmentName("Retirement Fund")
                .amount(new BigDecimal("5000.00"))
                .status("COMPLETED")
                .reference("WTH_12345")
                .build();

        when(withdrawalMapper.toResponseDTO(any(Withdrawal.class))).thenReturn(expectedResponse);

        // When
        WithdrawalResponseDTO response = withdrawalService.makeWithdrawal(1L, request);

        // Then
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(new BigDecimal("5000.00"), response.getAmount());
        assertEquals("COMPLETED", response.getStatus());

        verify(investmentRepository).save(any(Investment.class));
        verify(withdrawalRepository).save(any(Withdrawal.class));
    }

    @Test
    void createWithdrawal_InvestorNotFound_ThrowsException() {
        // Given
        when(investorRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> withdrawalService.makeWithdrawal(1L, request)
        );

        assertTrue(exception.getMessage().contains("Investor not found"));
        verify(investmentRepository, never()).findById(anyLong());
    }

    @Test
    void createWithdrawal_InvestmentNotFound_ThrowsException() {
        // Given
        when(investorRepository.findById(1L)).thenReturn(Optional.of(investor));
        when(investmentRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> withdrawalService.makeWithdrawal(1L, request)
        );

        assertTrue(exception.getMessage().contains("Investment not found"));
    }

    @Test
    void createWithdrawal_InvestmentDoesNotBelongToInvestor_ThrowsException() {
        // Given
        Investor differentInvestor = new Investor();
        differentInvestor.setId(2L);
        investment.setInvestor(differentInvestor);

        when(investorRepository.findById(1L)).thenReturn(Optional.of(investor));
        when(investmentRepository.findById(1L)).thenReturn(Optional.of(investment));

        // When & Then
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> withdrawalService.makeWithdrawal(1L, request)
        );

        assertTrue(exception.getMessage().contains("does not belong to this investor"));
    }

    @Test
    void createWithdrawal_ExceedsBalance_ThrowsException() {
        // Given
        request.setAmount(new BigDecimal("150000.00")); // Exceeds 100k balance

        when(investorRepository.findById(1L)).thenReturn(Optional.of(investor));
        when(investmentRepository.findById(1L)).thenReturn(Optional.of(investment));

        // When & Then
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> withdrawalService.makeWithdrawal(1L, request)
        );

        assertTrue(exception.getMessage().contains("exceeds maximum allowed") ||
                exception.getMessage().contains("Insufficient funds"));
        verify(investmentRepository, never()).save(any());
        verify(withdrawalRepository, never()).save(any());
    }

    @Test
    void createWithdrawal_Exceeds90Percent_ThrowsException() {
        // Given
        request.setAmount(new BigDecimal("95000.00")); // 95% of 100k

        when(investorRepository.findById(1L)).thenReturn(Optional.of(investor));
        when(investmentRepository.findById(1L)).thenReturn(Optional.of(investment));

        // When & Then
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> withdrawalService.makeWithdrawal(1L, request)
        );

        assertTrue(exception.getMessage().contains("90%"));
        verify(investmentRepository, never()).save(any());
    }

    @Test
    void createWithdrawal_ValidAmount_Success() {
        // Given
        request.setAmount(new BigDecimal("5000.00"));

        when(investorRepository.findById(1L)).thenReturn(Optional.of(investor));
        when(investmentRepository.findById(1L)).thenReturn(Optional.of(investment));
        when(investmentRepository.save(any(Investment.class))).thenReturn(investment);
        when(investorRepository.save(any(Investor.class))).thenReturn(investor);

        Withdrawal savedWithdrawal = new Withdrawal();
        savedWithdrawal.setId(1L);
        savedWithdrawal.setInvestor(investor);
        savedWithdrawal.setInvestment(investment);
        savedWithdrawal.setAmount(new BigDecimal("5000.00"));
        savedWithdrawal.setStatus(COMPLETED);
        savedWithdrawal.setWithdrawalDate(LocalDateTime.now());

        when(withdrawalRepository.save(any(Withdrawal.class))).thenReturn(savedWithdrawal);

        WithdrawalResponseDTO expectedResponse = WithdrawalResponseDTO.builder()
                .id(1L)
                .amount(new BigDecimal("5000.00"))
                .status("COMPLETED")
                .build();

        when(withdrawalMapper.toResponseDTO(any(Withdrawal.class))).thenReturn(expectedResponse);

        // When
        WithdrawalResponseDTO response = withdrawalService.makeWithdrawal(1L, request);

        // Then
        assertNotNull(response);
        assertEquals(new BigDecimal("5000.00"), response.getAmount());
    }

    @Test
    void createWithdrawal_ZeroAmount_ThrowsException() {
        // Given
        request.setAmount(BigDecimal.ZERO);

        when(investorRepository.findById(1L)).thenReturn(Optional.of(investor));
        when(investmentRepository.findById(1L)).thenReturn(Optional.of(investment));

        // When & Then
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> withdrawalService.makeWithdrawal(1L, request)
        );

        assertTrue(exception.getMessage().contains("exceeds maximum allowed") ||
                exception.getMessage().contains("must be greater"));
    }

    @Test
    void getWithdrawalHistory_Success() {
        // Given
        when(investorRepository.existsById(1L)).thenReturn(true);

        Withdrawal withdrawal1 = new Withdrawal();
        withdrawal1.setId(1L);
        withdrawal1.setInvestment(investment);
        withdrawal1.setAmount(new BigDecimal("5000.00"));
        withdrawal1.setStatus(COMPLETED);
        withdrawal1.setWithdrawalDate(LocalDateTime.now().minusDays(5));

        Withdrawal withdrawal2 = new Withdrawal();
        withdrawal2.setId(2L);
        withdrawal2.setInvestment(investment);
        withdrawal2.setAmount(new BigDecimal("3000.00"));
        withdrawal2.setStatus(COMPLETED);
        withdrawal2.setWithdrawalDate(LocalDateTime.now().minusDays(2));

        List<Withdrawal> withdrawals = Arrays.asList(withdrawal1, withdrawal2);

        when(withdrawalRepository.findByInvestorId(1L)).thenReturn(withdrawals);

        WithdrawalResponseDTO responseDto1 = WithdrawalResponseDTO.builder()
                .id(1L)
                .investmentName("Retirement Fund")
                .amount(new BigDecimal("5000.00"))
                .status("COMPLETED")
                .build();

        WithdrawalResponseDTO responseDto2 = WithdrawalResponseDTO.builder()
                .id(2L)
                .investmentName("Retirement Fund")
                .amount(new BigDecimal("3000.00"))
                .status("COMPLETED")
                .build();

        when(withdrawalMapper.toResponseDTO(withdrawal1)).thenReturn(responseDto1);
        when(withdrawalMapper.toResponseDTO(withdrawal2)).thenReturn(responseDto2);

        // When
        List<WithdrawalResponseDTO> history = withdrawalService.getWithdrawalHistory(1L);

        // Then
        assertNotNull(history);
        assertEquals(2, history.size());
        assertEquals(new BigDecimal("5000.00"), history.get(0).getAmount());
        assertEquals(new BigDecimal("3000.00"), history.get(1).getAmount());
    }

    @Test
    void getWithdrawalHistory_EmptyList_ReturnsEmpty() {
        // Given
        when(investorRepository.existsById(1L)).thenReturn(true);
        when(withdrawalRepository.findByInvestorId(1L)).thenReturn(Collections.emptyList());

        // When
        List<WithdrawalResponseDTO> history = withdrawalService.getWithdrawalHistory(1L);

        // Then
        assertNotNull(history);
        assertTrue(history.isEmpty());
    }

    @Test
    void getWithdrawalHistory_InvestorNotFound_ThrowsException() {
        // Given
        when(investorRepository.existsById(1L)).thenReturn(false);

        // When & Then
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> withdrawalService.getWithdrawalHistory(1L)
        );

        assertTrue(exception.getMessage().contains("Investor not found"));
    }

    @Test
    void getWithdrawalSummary_Success() {
        // Given
        when(investmentRepository.findById(1L)).thenReturn(Optional.of(investment));

        WithdrawalMapper.WithdrawalSummary summary =
                new WithdrawalMapper.WithdrawalSummary(
                        new BigDecimal("100000.00"),
                        new BigDecimal("90000.00"),
                        new BigDecimal("10000.00"),
                        new BigDecimal("0.90")
                );

        when(withdrawalMapper.getWithdrawalSummary(investment)).thenReturn(summary);

        // When
        WithdrawalMapper.WithdrawalSummary result = withdrawalService.getWithdrawalSummary(1L);

        // Then
        assertNotNull(result);
        assertEquals(new BigDecimal("100000.00"), result.getCurrentBalance());
        assertEquals(new BigDecimal("90000.00"), result.getMaxWithdrawalAmount());
        assertEquals(new BigDecimal("0.90"), result.getWithdrawalPercentage());
    }

    @Test
    void getWithdrawalSummary_InvestmentNotFound_ThrowsException() {
        // Given
        when(investmentRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> withdrawalService.getWithdrawalSummary(1L)
        );

        assertTrue(exception.getMessage().contains("Investment not found"));
    }
}