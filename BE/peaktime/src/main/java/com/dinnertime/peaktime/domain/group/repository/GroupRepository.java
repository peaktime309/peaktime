package com.dinnertime.peaktime.domain.group.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dinnertime.peaktime.domain.group.entity.Group;

public interface GroupRepository extends JpaRepository<Group,Long> {
}
