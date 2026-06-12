package com.enviro.assessment.junior.tebohothulaninyombolo.service;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.CsvExportRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Withdrawal;
import com.enviro.assessment.junior.tebohothulaninyombolo.enums.Status;
import com.enviro.assessment.junior.tebohothulaninyombolo.exception.ResourceNotFoundException;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestorRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.WithdrawalRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.chrono.ChronoLocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class CsvExportService {

    private final WithdrawalRepository withdrawalRepository;
    private final InvestorRepository investorRepository;

    public CsvExportService(WithdrawalRepository withdrawalRepository,
                            InvestorRepository investorRepository) {
        this.withdrawalRepository = withdrawalRepository;
        this.investorRepository = investorRepository;
    }

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static final DateTimeFormatter DATETIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private static final String CSV_HEADER =
            "ID,Investor Name,Product Name,Amount,Withdrawal Date,Status,Reference\n";

    public byte[] exportWithdrawalsToCsv(CsvExportRequestDTO request) {

        if (!investorRepository.existsById(request.getInvestorId())) {
            throw new ResourceNotFoundException("Investor not found with ID: " + request.getInvestorId());
        }

        // Get withdrawals for the investor
        List<Withdrawal> withdrawals = withdrawalRepository.findByInvestorId(request.getInvestorId());

        // Filter by product if specified
        if (request.getProductId() != null) {
            withdrawals = withdrawals.stream()
                    .filter(w -> w.getInvestment() != null &&
                            w.getInvestment().getId().equals(request.getProductId()))
                    .toList();
        }

        // Filter by date range if specified
        if (request.getFromDate() != null) {
            withdrawals = withdrawals.stream()
                    .filter(w -> w.getWithdrawalDate() != null &&
                            !w.getWithdrawalDate().isBefore(ChronoLocalDateTime.from(request.getFromDate())))
                    .toList();
        }

        if (request.getToDate() != null) {
            withdrawals = withdrawals.stream()
                    .filter(w -> w.getWithdrawalDate() != null &&
                            !w.getWithdrawalDate().isAfter(ChronoLocalDateTime.from(request.getToDate())))
                    .toList();
        }

        // Filter by status if specified
        if (request.getStatus() != null) {
            Status status = Status.valueOf(request.getStatus().toUpperCase());
            withdrawals = withdrawals.stream()
                    .filter(w -> {
                        return w.getStatus() != null &&
                                w.getStatus().equals(status.name());
                    })
                    .toList();
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            // Add BOM for Excel compatibility (UTF-8 with BOM)
            outputStream.write(new byte[]{(byte)0xEF, (byte)0xBB, (byte)0xBF});

            try (PrintWriter writer = new PrintWriter(
                    new OutputStreamWriter(outputStream, StandardCharsets.UTF_8))) {

                writer.print(CSV_HEADER);

                for (Withdrawal w : withdrawals) {
                    String investorName = (w.getInvestor() != null)
                            ? w.getInvestor().getFirstName() + " " + w.getInvestor().getLastName()
                            : "";

                    // FIXED: Use getInvestment() instead of getProduct()
                    String productName = (w.getInvestment() != null)
                            ? w.getInvestment().getProductName()
                            : "";

                    String withdrawalDate = w.getWithdrawalDate() != null
                            ? w.getWithdrawalDate().format(DATE_FORMATTER)
                            : "";

                    writer.printf("%d,%s,%s,%.2f,%s,%s,%s%n",
                            w.getId(),
                            escapeCsv(investorName),
                            escapeCsv(productName),
                            w.getAmount(),
                            withdrawalDate,
                            w.getStatus(),
                            escapeCsv(w.getReference())
                    );
                }

                writer.flush();
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate CSV", e);
        }

        return outputStream.toByteArray();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";

        // Escape quotes and wrap in quotes if contains special characters
        if (value.contains(",") || value.contains("\"") || value.contains("\n") || value.contains("\r")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }

        return value;
    }
}