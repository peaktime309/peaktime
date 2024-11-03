package com.dinnertime.peaktime.domain.hiking.repository;

import com.dinnertime.peaktime.domain.hiking.entity.Hiking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HikingRepository extends JpaRepository<Hiking, Long> {
}
