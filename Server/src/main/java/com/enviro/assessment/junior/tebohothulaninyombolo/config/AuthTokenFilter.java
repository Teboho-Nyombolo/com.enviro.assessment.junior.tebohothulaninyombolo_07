package com.enviro.assessment.junior.tebohothulaninyombolo.config;

import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

public class AuthTokenFilter extends OncePerRequestFilter {

    private final AuthService authService;

    public AuthTokenFilter(AuthService authService) {
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("=== AUTH TOKEN FILTER ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Authorization header: " + (authHeader != null ? authHeader.substring(0, Math.min(20, authHeader.length())) + "..." : "null"));

        // Skip token validation for auth endpoints
        if (request.getRequestURI().startsWith("/api/auth/")) {
            System.out.println("Skipping auth endpoint");
            filterChain.doFilter(request, response);
            return;
        }

        // Check if we have a token (not Basic Auth)
        if (authHeader != null && !authHeader.startsWith("Basic ")) {
            String token = authHeader;

            // Remove "Bearer " prefix if present
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            System.out.println("Validating token: " + token);

            try {
                // Validate token using your AuthService
                Investor investor = authService.validateToken(token);

                System.out.println("Investor found: " + investor.getEmail());
                System.out.println("Investor ID: " + investor.getId());

                if (investor != null) {
                    // CRITICAL: Set the authority with ROLE_ prefix
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_INVESTOR");

                    // Create authentication object
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    investor,  // principal
                                    null,      // credentials
                                    Collections.singletonList(authority)  // authorities
                            );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("✅ Authentication set in SecurityContext");
                    System.out.println("Authorities: " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());
                } else {
                    System.out.println("❌ Investor is null after validation");
                }
            } catch (Exception e) {
                System.out.println("❌ Token validation failed: " + e.getMessage());
                e.printStackTrace();
                // Don't set authentication - request will be forbidden
            }
        } else {
            System.out.println("No valid Authorization header found");
        }

        filterChain.doFilter(request, response);
    }
}