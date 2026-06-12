package com.enviro.assessment.junior.tebohothulaninyombolo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CsvExportRequestDTO {

    private Long investorId;
    private Long productId;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    private String status;
}
