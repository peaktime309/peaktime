package com.dinnertime.peaktime.domain.group.repository;

import com.dinnertime.peaktime.domain.user.entity.QUser;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.usergroup.entity.QUserGroup;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class GroupRepositoryCustomImpl implements GroupRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final QUserGroup userGroup = QUserGroup.userGroup;
    private final QUser user = QUser.user;

    @Override
    public List<User> findUserListByGroupId(Long groupId) {
        return queryFactory.select(user)
                .from(userGroup)
                .where(userGroup.group.groupId.eq(groupId).and(userGroup.user.isDelete.isFalse()))
                .fetch();
    }
}
