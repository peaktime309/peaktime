package com.dinnertime.peaktime.domain.user.repository;

import com.dinnertime.peaktime.domain.user.entity.User;

import java.util.List;

public interface UserRepositoryCustom {
    List<User> findAllByGroupIdAndIsDelete(Long groupId, Boolean isDelete);
}
