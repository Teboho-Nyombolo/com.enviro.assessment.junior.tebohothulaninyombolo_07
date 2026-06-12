package com.enviro.assessment.junior.tebohothulaninyombolo.controller;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.CsvExportRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.service.CsvExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class CsvExportController {

    private final CsvExportService csvExportService;

    public CsvExportController(CsvExportService csvExportService) {
        this.csvExportService = csvExportService;
    }

    @PostMapping("/csv")
    public ResponseEntity<byte[]> exportWithdrawalsToCsv(
            Authentication authentication,
            @RequestBody CsvExportRequestDTO request) {

        Long investorId = getInvestorIdFromAuthentication(authentication);

        // Ensure investor can only export their own data
        if (!investorId.equals(request.getInvestorId())) {
            return ResponseEntity.status(403).build();
        }

        byte[] csvData = csvExportService.exportWithdrawalsToCsv(request);

        String filename = "withdrawals_export_" +
                java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) +
                ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    @GetMapping("/csv/{investorId}")
    public ResponseEntity<byte[]> exportAllWithdrawals(
            Authentication authentication,
            @PathVariable Long investorId) {

        Long currentInvestorId = getInvestorIdFromAuthentication(authentication);

        if (!currentInvestorId.equals(investorId)) {
            return ResponseEntity.status(403).build();
        }

        CsvExportRequestDTO request = new CsvExportRequestDTO();
        request.setInvestorId(investorId);

        byte[] csvData = csvExportService.exportWithdrawalsToCsv(request);

        String filename = "withdrawals_export_" +
                java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) +
                ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    private Long getInvestorIdFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Investor) {
            return ((Investor) principal).getId();
        }

        throw new RuntimeException("Unable to extract investor ID");
    }
}