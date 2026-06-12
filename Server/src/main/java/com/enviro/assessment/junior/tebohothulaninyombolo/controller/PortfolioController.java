package com.enviro.assessment.junior.tebohothulaninyombolo.controller;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.ApiResponse;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.PortfolioResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = "*")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/{investorId}")
    public ResponseEntity<ApiResponse<PortfolioResponseDTO>> getPortfolio(
            Authentication authentication,
            @PathVariable Long investorId) {

        Long currentInvestorId = getInvestorIdFromAuthentication(authentication);

        // Ensure investor can only access their own portfolio
        if (!currentInvestorId.equals(investorId)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error(null));
        }

        PortfolioResponseDTO portfolio = portfolioService.getPortfolioByInvestorId(investorId);
        return ResponseEntity.ok(ApiResponse.success("Portfolio retrieved successfully", portfolio));
    }

    private Long getInvestorIdFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Investor) {
            return ((Investor) principal).getId();
        }

        throw new RuntimeException("Unable to extract investor ID from authentication");
    }
}