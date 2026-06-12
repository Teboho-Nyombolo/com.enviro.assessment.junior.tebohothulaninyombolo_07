package com.enviro.assessment.junior.tebohothulaninyombolo.controller;


import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.DepositRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.ApiResponse;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.DepositResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.service.DepositService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deposits")
@CrossOrigin(origins = "*")
public class DepositController {

    private final DepositService depositService;

    public DepositController(DepositService depositService) {
        this.depositService = depositService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DepositResponseDTO>> makeDeposit(
            Authentication authentication,
            @Valid @RequestBody DepositRequestDTO request) {

        Long investorId = getInvestorIdFromAuthentication(authentication);
        DepositResponseDTO deposit = depositService.makeDeposit(investorId, request);
        return ResponseEntity.ok(ApiResponse.success("Deposit successful", deposit));
    }

    @GetMapping("/history/{investorId}")
    public ResponseEntity<ApiResponse<List<DepositResponseDTO>>> getDepositHistory(
            Authentication authentication,
            @PathVariable Long investorId) {

        Long currentInvestorId = getInvestorIdFromAuthentication(authentication);

        if (!currentInvestorId.equals(investorId)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error(null));
        }

        List<DepositResponseDTO> deposits = depositService.getDepositHistory(investorId);
        return ResponseEntity.ok(ApiResponse.success("Deposit history retrieved", deposits));
    }

    private Long getInvestorIdFromAuthentication(Authentication authentication) {
        return ((Investor) authentication.getPrincipal()).getId();
    }
}
