package com.dinnertime.peaktime.domain.user.repository;

import com.dinnertime.peaktime.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, UserRepositoryCustom {
    Optional<User> findByUserIdAndIsDeleteFalse(long userId);
    Optional<User> findByUserId(long userId);
    Optional<User> findByUserLoginId(String userLoginId);
    Optional<User> findByUserLoginIdAndIsDeleteFalse(String userLoginId);
    Optional<User> findByEmail(String email);
    // 자식 계정 조회
    Optional<User> findByUserIdAndIsDeleteFalseAndIsRootFalse(long userId);

    List<User> findAllByIsDeleteIsFalse();
}
