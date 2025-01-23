package com.dinnertime.peaktime.domain.statistic.repository;

import com.dinnertime.peaktime.domain.statistic.entity.Statistic;
import com.dinnertime.peaktime.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StatisticRepository extends JpaRepository<Statistic, Long> {
    //이미 존재하는 유저일 경우 statistic없어서 optional처리
    Optional<Statistic> findByUser_UserId(Long userId);

    List<Statistic> findAllByUserIn(List<User> userList);

}
