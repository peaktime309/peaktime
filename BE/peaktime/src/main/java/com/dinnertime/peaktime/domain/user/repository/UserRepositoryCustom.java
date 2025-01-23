package com.dinnertime.peaktime.domain.user.repository;

import com.dinnertime.peaktime.domain.user.entity.User;

import java.util.Optional;

public interface UserRepositoryCustom {
    Long updateIsDeleteByGroupId(Long groupId);
    Long updateIsDeleteByRootUserId(Long rootUserId);

    Optional<User> findUserByRootUserInGroup(Long rootUserId, Long subUserId);
}
