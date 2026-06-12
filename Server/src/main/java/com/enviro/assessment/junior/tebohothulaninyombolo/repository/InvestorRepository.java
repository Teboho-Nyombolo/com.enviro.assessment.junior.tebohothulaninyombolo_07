package com.enviro.assessment.junior.tebohothulaninyombolo.repository;

import com.enviro.assessment.junior.tebohothulaninyombolo.entity.Investor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InvestorRepository extends JpaRepository<Investor, Long> {

    Optional<Investor> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Investor> findByAuthToken(String authToken);

    @Query("SELECT i FROM Investor i LEFT JOIN FETCH i.products WHERE i.id = :id")
    Optional<Investor> findByIdWithProducts(@Param("id") Long id);
}
