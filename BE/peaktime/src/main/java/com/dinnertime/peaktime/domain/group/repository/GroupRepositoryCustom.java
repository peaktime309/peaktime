package com.dinnertime.peaktime.domain.group.repository;

import com.dinnertime.peaktime.domain.user.entity.User;

import java.util.List;

public interface GroupRepositoryCustom {
    List<User> findUserListByGroupId(Long groupId);
}
