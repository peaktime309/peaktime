package com.dinnertime.peaktime.domain.schedule.repository;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

public interface EmitterRepository {
    SseEmitter save(String emitterId, SseEmitter emitter);

    void saveEventCache(String emitterId, Object event);

    //key값의 경우 groupId로 시작하므로
    Map<String, SseEmitter> findEmitterByGroupId(Long groupId);

    //key값의 경우 groupId로 시작하므로
    Map<String, Object> findEmitterCacheByGroupId(Long groupId);

    void deleteById(String emitterId);

    void deleteEmitterAllByGroupId(Long groupId);

    void deleteCacheAllByGroupId(Long groupId);
}
