package com.enviro.assessment.junior.tebohothulaninyombolo.controller;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.WithdrawalRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.ApiResponse;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.WithdrawalResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.service.WithdrawalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/withdrawals")
@CrossOrigin(origins = "*")
public class WithdrawalController {

    private final WithdrawalService withdrawalService;

    public WithdrawalController(WithdrawalService withdrawalService) {
        this.withdrawalService = withdrawalService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WithdrawalResponseDTO>> makeWithdrawal(
            Authentication authentication,
            @Valid @RequestBody WithdrawalRequestDTO request) {

        Long investorId = getInvestorIdFromAuthentication(authentication);
        WithdrawalResponseDTO withdrawal = withdrawalService.makeWithdrawal(investorId, request);
        return ResponseEntity.ok(ApiResponse.success("Withdrawal successful", withdrawal));
    }

    @GetMapping("/history/{investorId}")
    public ResponseEntity<ApiResponse<List<WithdrawalResponseDTO>>> getWithdrawalHistory(
            Authentication authentication,
            @PathVariable Long investorId) {

        Long currentInvestorId = getInvestorIdFromAuthentication(authentication);

        if (!currentInvestorId.equals(investorId)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error(null));
        }

        List<WithdrawalResponseDTO> withdrawals = withdrawalService.getWithdrawalHistory(investorId);
        return ResponseEntity.ok(ApiResponse.success("Withdrawal history retrieved", withdrawals));
    }

    private Long getInvestorIdFromAuthentication(Authentication authentication) {
        return ((Investor) authentication.getPrincipal()).getId();
    }
}