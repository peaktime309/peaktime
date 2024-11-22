package com.dinnertime.peaktime.domain.user.repository;

import com.dinnertime.peaktime.domain.group.entity.QGroup;
import com.dinnertime.peaktime.domain.user.entity.QUser;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.usergroup.entity.QUserGroup;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final QUser user = QUser.user;
    private final QGroup group = QGroup.group;
    private final QUserGroup userGroup = QUserGroup.userGroup;

    @Override
    public Long updateIsDeleteByGroupId(Long groupId) {
        List<Long> childUserIdList = queryFactory.select(userGroup.user.userId)
                .from(userGroup)
                .where(userGroup.group.groupId.eq(groupId))
                .fetch();

        return queryFactory
                .update(user)
                .set(user.isDelete, true)
                .where(user.userId.in(childUserIdList))
                .execute();
    }

    @Override
    public Long updateIsDeleteByRootUserId(Long rootUserId) {
        //childUserList가 캐싱되어 성능 빨라짐
        List<Long> childUserIdList = queryFactory.select(userGroup.user.userId)
                .from(userGroup)
                .join(group)
                .on(userGroup.group.groupId.eq(group.groupId))
                .where(
                        group.user.userId.eq(rootUserId)
                                .and(group.isDelete.isFalse())
                ).fetch();

        return queryFactory.update(user)
                .set(user.isDelete, true)
                .where(
                        user.userId.in(childUserIdList)
                                .and(user.isDelete.isFalse()))
                .execute();

//          밑의 방식은 유저를 업데이트할때마다 즉 한 행마다 서브쿼리 수행하여 성능 저하 발생
//        return queryFactory
//                .update(user)
//                .set(user.isDelete, true)
//                .where(user.userId.in(
//                        JPAExpressions
//                                .select(userGroup.user.userId)
//                                .from(userGroup)
//                                .where(userGroup.group.groupId.in(
//                                        JPAExpressions
//                                                .select(group.groupId)
//                                                .from(group)
//                                                .where(group.user.userId.eq(rootUserId)
//                                                        .and(group.isDelete.eq(false)))
//                                ))
//                ))
//                .execute();
    }

    @Override
    public Optional<User> findUserByRootUserInGroup(Long rootUserId, Long subUserId) {
        return Optional.ofNullable(queryFactory.select(user)
                .from(user)
                .join(userGroup)
                .on(user.userId.eq(userGroup.user.userId))
                .join(group)
                .on(userGroup.group.groupId.eq(group.groupId))
                .where(group.user.userId.eq(rootUserId).and(group.isDelete.isFalse()).and(user.userId.eq(subUserId)).and(user.isDelete.isFalse()))
                .fetchOne());
    }

}