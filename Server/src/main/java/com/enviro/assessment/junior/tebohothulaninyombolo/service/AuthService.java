package com.enviro.assessment.junior.tebohothulaninyombolo.service;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.InvestorLoginRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.InvestorRegisterRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.InvestorResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.exception.AuthenticationException;
import com.enviro.assessment.junior.tebohothulaninyombolo.exception.WithdrawalValidationException;
import com.enviro.assessment.junior.tebohothulaninyombolo.mapper.InvestorMapper;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final InvestorRepository investorRepository;
    private final InvestorMapper investorMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthService(InvestorRepository investorRepository,
                       InvestorMapper investorMapper,
                       PasswordEncoder passwordEncoder) {
        this.investorRepository = investorRepository;
        this.investorMapper = investorMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public InvestorResponseDTO register(InvestorRegisterRequestDTO request) {
        System.out.println("=== REGISTERING NEW INVESTOR ===");
        System.out.println("Email: " + request.getEmail());

        // Check if email already exists
        if (investorRepository.existsByEmail(request.getEmail())) {
            throw new AuthenticationException("Email already registered: " + request.getEmail());
        }

        // Create new investor
        Investor investor = investorMapper.toEntity(request);
        investor.setPassword(passwordEncoder.encode(request.getPassword()));

        // Save first to get ID
        Investor saved = investorRepository.save(investor);
        System.out.println("Saved investor with ID: " + saved.getId());

        // Generate and set token
        String token = generateToken();
        saved.setAuthToken(token);

        // CRITICAL: Save again to persist the token
        Investor updated = investorRepository.save(saved);
        System.out.println("Token saved: " + token);
        System.out.println("Token in DB: " + updated.getAuthToken());

        return investorMapper.toResponseDTOWithToken(updated, token);
    }

    @Transactional
    public InvestorResponseDTO login(InvestorLoginRequestDTO request) {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email: " + request.getEmail());

        Investor investor = investorRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));

        System.out.println("Found investor: " + investor.getEmail());
        System.out.println("Stored password hash: " + investor.getPassword());

        if (!passwordEncoder.matches(request.getPassword(), investor.getPassword())) {
            System.out.println("Password mismatch!");
            throw new AuthenticationException("Invalid email or password");
        }

        System.out.println("Password matched!");

        // Generate new token
        String token = generateToken();
        investor.setAuthToken(token);

        // CRITICAL: Save the token to database
        Investor updated = investorRepository.save(investor);
        System.out.println("New token generated and saved: " + token);
        System.out.println("Token saved successfully: " + updated.getAuthToken());

        return investorMapper.toResponseDTOWithToken(updated, token);
    }

    public Investor validateToken(String token) {
        System.out.println("=== VALIDATING TOKEN ===");
        System.out.println("Token to validate: " + token);

        if (token == null || token.isBlank()) {
            System.out.println("Token is null or blank");
            throw new AuthenticationException("Invalid or expired token");
        }

        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
            System.out.println("Removed Bearer prefix, token now: " + token);
        }

        Investor investor = investorRepository.findByAuthToken(token)
                .orElse(null);

        if (investor == null) {
            System.out.println("❌ No investor found with token: " + token);
            // Debug: Check what tokens exist in DB
            investorRepository.findAll().forEach(i -> {
                System.out.println("Investor ID: " + i.getId() +
                        ", Email: " + i.getEmail() +
                        ", Token: " + i.getAuthToken());
            });
            throw new AuthenticationException("Invalid or expired token");
        }

        System.out.println("✅ Token validated for investor: " + investor.getEmail());
        System.out.println("Investor ID: " + investor.getId());
        return investor;
    }

    private String generateToken() {
        String token = UUID.randomUUID().toString();
        System.out.println("Generated new token: " + token);
        return token;
    }
}
