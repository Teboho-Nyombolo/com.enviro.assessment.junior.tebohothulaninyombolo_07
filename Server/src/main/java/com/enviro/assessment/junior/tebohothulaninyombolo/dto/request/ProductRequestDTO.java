package com.enviro.assessment.junior.tebohothulaninyombolo.dto.request;

import com.enviro.assessment.junior.tebohothulaninyombolo.enums.ProductType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequestDTO {

    private Long investorId;
    private String productName;
    private ProductType productType;

}
