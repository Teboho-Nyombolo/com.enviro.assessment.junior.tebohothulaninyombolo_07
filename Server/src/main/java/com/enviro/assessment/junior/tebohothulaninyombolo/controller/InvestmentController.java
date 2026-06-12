package com.enviro.assessment.junior.tebohothulaninyombolo.controller;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.InvestmentRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.InvestmentResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.ApiResponse;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.service.InvestmentService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investments")
@CrossOrigin(origins = "*")
public class InvestmentController {

    private final InvestmentService investmentService;

    public InvestmentController(InvestmentService investmentService) {
        this.investmentService = investmentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InvestmentResponseDTO>> createInvestment(
            Authentication authentication,
            @Valid @RequestBody InvestmentRequestDTO request) {

        Long investorId = getInvestorIdFromAuthentication(authentication);
        InvestmentResponseDTO response = investmentService.createInvestment(investorId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Investment created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InvestmentResponseDTO>>> getMyInvestments(
            Authentication authentication) {

        Long investorId = getInvestorIdFromAuthentication(authentication);
        List<InvestmentResponseDTO> investments = investmentService.getInvestmentsByInvestor(investorId);

        return ResponseEntity.ok(ApiResponse.success("Investments retrieved successfully", investments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvestmentResponseDTO>> getInvestmentById(@PathVariable Long id) {
        InvestmentResponseDTO investment = investmentService.getInvestmentById(id);
        return ResponseEntity.ok(ApiResponse.success("Investment retrieved successfully", investment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InvestmentResponseDTO>> updateInvestment(
            @PathVariable Long id,
            @Valid @RequestBody InvestmentRequestDTO request) {

        InvestmentResponseDTO investment = investmentService.updateInvestment(id, request);
        return ResponseEntity.ok(ApiResponse.success("Investment updated successfully", investment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInvestment(@PathVariable Long id) {
        investmentService.deleteInvestment(id);
        return ResponseEntity.ok(ApiResponse.success("Investment deleted successfully", null));
    }

    private Long getInvestorIdFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Investor) {
            Long investorId = ((Investor) principal).getId();
            System.out.println("Extracted Investor ID from Authentication: " + investorId);
            return investorId;
        }

        throw new RuntimeException("Unable to extract investor ID from authentication");
    }
}