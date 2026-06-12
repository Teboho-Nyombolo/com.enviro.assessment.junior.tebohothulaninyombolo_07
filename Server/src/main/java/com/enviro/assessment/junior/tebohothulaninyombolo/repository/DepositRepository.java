package com.enviro.assessment.junior.tebohothulaninyombolo.repository;

import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Deposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepositRepository extends JpaRepository<Deposit, Long> {

    List<Deposit> findByInvestorIdOrderByCreatedAtDesc(Long investorId);

    List<Deposit> findByInvestor_IdOrderByCreatedAtDesc(Long investorId);

}
