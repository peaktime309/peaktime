package com.dinnertime.peaktime.domain.preset.repository;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PresetRepository extends JpaRepository<Preset, Long> {

    List<Preset> findAllByUser_UserIdOrderByPresetIdAsc(Long  userId);

    Optional<Preset> findByPresetId(Long presetId);
}
