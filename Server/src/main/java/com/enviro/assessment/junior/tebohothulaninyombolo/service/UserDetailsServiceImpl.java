package com.enviro.assessment.junior.tebohothulaninyombolo.service;

import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import com.enviro.assessment.junior.tebohothulaninyombolo.repository.InvestorRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("investorUserDetailsService")
public class UserDetailsServiceImpl implements UserDetailsService {

    private InvestorRepository investorRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Investor investor = investorRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Investor not found: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(investor.getEmail())
                .password(investor.getPassword())
                .roles("INVESTOR")
                .build();
    }
}
