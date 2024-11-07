package com.dinnertime.peaktime.domain.hiking.repository;

import com.dinnertime.peaktime.domain.hiking.entity.Hiking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HikingRepository extends JpaRepository<Hiking, Long>, HikingRepositoryCustom {
    Optional<Hiking> findByHikingId(Long hikingId);
}
