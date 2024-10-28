package com.dinnertime.peaktime.domain.preset.repository;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PresetRepository extends JpaRepository<Preset, Long> {


}
