package com.dinnertime.peaktime.domain.summary.repository;

import com.dinnertime.peaktime.domain.summary.entity.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SummaryRepository extends JpaRepository<Summary, Long> {


}
