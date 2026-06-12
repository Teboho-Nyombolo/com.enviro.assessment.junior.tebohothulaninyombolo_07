package com.enviro.assessment.junior.tebohothulaninyombolo.repository;

import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Withdrawal;
import com.enviro.assessment.junior.tebohothulaninyombolo.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long >  {

    List<Withdrawal> findByInvestorId(Long investorId);

    List<Withdrawal> findByInvestor_IdOrderByCreatedAtDesc(Long investorId);

    List<Withdrawal> findByInvestorIdOrderByCreatedAtDesc(Long investorId);

    @Query("SELECT w FROM Withdrawal w WHERE w.investor.id = :investorId " +
           "AND (:productId IS NULL OR w.investment.id = :productId) " +
           "AND (:fromDate IS NULL OR w.withdrawalDate >= :fromDate) " +
           "AND (:toDate IS NULL OR w.withdrawalDate <= :toDate) " +
           "AND (:status IS NULL OR w.status = :status)")
    List<Withdrawal> findByFilters(@Param("investorId") Long investorId,
                                   @Param("productId") Long productId,
                                   @Param("fromDate") LocalDateTime fromDate,
                                   @Param("toDate") LocalDateTime toDate,
                                   @Param("status") String status);
}
