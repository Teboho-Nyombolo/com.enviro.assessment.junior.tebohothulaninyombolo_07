package com.enviro.assessment.junior.tebohothulaninyombolo.controller;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.InvestorLoginRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.InvestorRegisterRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.ApiResponse;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.InvestorResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<InvestorResponseDTO>> login(
            @Valid @RequestBody InvestorLoginRequestDTO request) {

        InvestorResponseDTO response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.success("Login successful", response)
        );
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<InvestorResponseDTO>> register(
            @Valid @RequestBody InvestorRegisterRequestDTO request) {

        InvestorResponseDTO response = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registered successfully", response));
    }
}