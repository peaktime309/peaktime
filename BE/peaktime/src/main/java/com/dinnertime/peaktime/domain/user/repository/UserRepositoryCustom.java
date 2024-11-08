package com.dinnertime.peaktime.domain.user.repository;

public interface UserRepositoryCustom {
    Long updateIsDeleteByGroupId(Long groupId, Boolean isDelete);
    Long updateIsDeleteByRootUserId(Long rootUserId);
}
