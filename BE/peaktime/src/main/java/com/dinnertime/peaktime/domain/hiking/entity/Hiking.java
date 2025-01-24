package com.dinnertime.peaktime.domain.hiking.entity;

import com.dinnertime.peaktime.domain.hiking.service.dto.request.StartHikingRequestDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "hikings")
public class Hiking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hiking_id")
    private Long hikingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "is_self", nullable = false)
    private Boolean isSelf;

    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
    @Column(name = "real_end_time")
    private LocalDateTime realEndTime;

    @Builder
    private Hiking(User user, LocalDateTime startTime, LocalDateTime endTime, Boolean isSelf, LocalDateTime realEndTime) {
        this.user = user;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isSelf = isSelf;
        this.realEndTime = realEndTime;
    }

    public static Hiking createHiking(User user, StartHikingRequestDto requestDto, LocalDateTime endTime) {

        return Hiking.builder()
                .user(user)
                .startTime(requestDto.getStartTime())
                .endTime(endTime)
                .isSelf(requestDto.getIsSelf())
                .build();
    }

    public void updateRealEndTime(LocalDateTime realEndTime) {
        this.realEndTime = realEndTime;
    }
}
