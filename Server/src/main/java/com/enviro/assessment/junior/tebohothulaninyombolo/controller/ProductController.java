package com.enviro.assessment.junior.tebohothulaninyombolo.controller;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.ProductRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.ProductResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {


    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/create")
    public ResponseEntity<ProductResponseDTO> createProduct(
            @RequestBody ProductRequestDTO request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(request));
    }
}