package com.dinnertime.peaktime.domain.preset.repository;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresetRepository extends JpaRepository<Preset, Long> {

    List<Preset> findAllByUser(User user);

}
