package com.enviro.assessment.junior.tebohothulaninyombolo.service;

import com.enviro.assessment.junior.tebohothulaninyombolo.dto.request.ProductRequestDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.ProductResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investment;
import com.enviro.assessment.junior.tebohothulaninyombolo.dto.response.PortfolioResponseDTO;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Deposit;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Product;
import com.enviro.assessment.junior.tebohothulaninyombolo.enums.ProductType;
import com.enviro.assessment.junior.tebohothulaninyombolo.exception.ResourceNotFoundException;
import com.enviro.assessment.junior.tebohothulaninyombolo.exception.WithdrawalValidationException;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.DepositRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestorRepository;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import static com.enviro.assessment.junior.tebohothulaninyombolo.enums.Status.COMPLETED;

@Service
public class ProductService {

    private final InvestorRepository investorRepository;
    private final ProductRepository productRepository;
    private final DepositRepository depositTransactionRepository;
    private final PortfolioService portfolioService;

    public ProductService(
            InvestorRepository investorRepository,
            ProductRepository productRepository,
            DepositRepository depositTransactionRepository,
            PortfolioService portfolioService) {
        this.investorRepository = investorRepository;
        this.productRepository = productRepository;
        this.depositTransactionRepository = depositTransactionRepository;
        this.portfolioService = portfolioService;
    }

    // For InvestmentController (creates product + initial deposit + returns portfolio)

    public PortfolioResponseDTO createInvestment(Investment request) {
        Investor investor = investorRepository.findById(request.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Investor", request.getId()));

        ProductType productType;
        try {
            productType = ProductType.valueOf(request.getProductType());
        } catch (IllegalArgumentException e) {
            throw new WithdrawalValidationException("Invalid product type. Must be RETIREMENT, SAVINGS, or INVESTMENT");
        }

        if (request.getInitialDeposit().compareTo(new BigDecimal("100")) < 0) {
            throw new WithdrawalValidationException("Minimum initial deposit is R 100");
        }

        Product product = new Product();
        product.setProductName(request.getProductName());
        product.setProductType(productType);
        product.setBalance(request.getInitialDeposit());
        product.setInvestor(investor);

        BigDecimal maxWithdrawal = request.getInitialDeposit()
                .multiply(new BigDecimal("0.9"))
                .setScale(2, RoundingMode.HALF_UP);
        product.setMaxWithdrawalAmount(maxWithdrawal);

        productRepository.save(product);

        Deposit deposit = new Deposit();
        deposit.setAmount(request.getInitialDeposit());
        deposit.setAmount(BigDecimal.ZERO);
        deposit.setDepositDate(LocalDateTime.now());
        deposit.setStatus(COMPLETED);
        deposit.setReference("Initial deposit for " + request.getProductName());
        deposit.setInvestor(investor);
        deposit.setProduct(product.getProductType());

        depositTransactionRepository.save(deposit);

        return portfolioService.getPortfolioByInvestorId(investor.getId());
    }

    // For ProductController (creates product only, returns product DTO)

    public ProductResponseDTO createProduct(ProductRequestDTO request) {
        Investor investor = investorRepository.findById(request.getInvestorId())
                .orElseThrow(() -> new ResourceNotFoundException("Investor", request.getInvestorId()));

        ProductType productType;
        try {
            productType = ProductType.valueOf(request.getProductType().name());
        } catch (IllegalArgumentException e) {
            throw new WithdrawalValidationException("Invalid product type. Must be RETIREMENT, SAVINGS, or INVESTMENT");
        }

        Product product = new Product();
        product.setProductName(request.getProductName());
        product.setProductType(productType);
        product.setBalance(BigDecimal.ZERO); // Start with zero, deposit separately
        product.setMaxWithdrawalAmount(BigDecimal.ZERO);
        product.setInvestor(investor);

        Product saved = productRepository.save(product);

        return mapToProductResponseDTO(saved);
    }

    private ProductResponseDTO mapToProductResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .productName(product.getProductName())
                .productType(product.getProductType().name())
                .balance(product.getBalance())
                .maxWithdrawalAmount(product.getMaxWithdrawalAmount())
                .build();
    }
}
