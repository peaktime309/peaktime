package com.dinnertime.peaktime.domain.schedule.repository;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

//사용자 정보만 저장
@Repository
public class EmitterRepositoryImpl implements EmitterRepository {
    //동시에 여러 사람이 접근해도 thread-safe한 ConcurrentHashMap
    private final Map<String, SseEmitter> emitterList = new ConcurrentHashMap<>();
    //사용자에게 주지 못한 이벤트들 저장하여 후에 이벤트를 보내주는 맵
    private final Map<String, Object> eventCache = new ConcurrentHashMap<>();

    @Override
    public SseEmitter save(String emitterId, SseEmitter emitter) {
        //각 사용자 sse저장
        emitterList.put(emitterId, emitter);
        return emitter;
    }

    @Override
    public void saveEventCache(String emitterId, Object event) {
        //이벤트 캐시에 저장
        eventCache.put(emitterId, event);
    }

    //key값의 경우 groupId로 시작하므로
    @Override
    public Map<String, SseEmitter> findEmitterByGroupId(Long groupId) {
        //entrySet -> 모든 키, 값을 set객체로 생성
        return emitterList.entrySet().stream()
                //groupId로 시작하는 것들 모두 가져와서 map으로 만들어서 반환
                .filter(entry -> entry.getKey().startsWith(groupId.toString()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    //key값의 경우 groupId로 시작하므로
    @Override
    public Map<String, Object> findEmitterCacheByGroupId(Long groupId) {
        //entrySet -> 모든 키, 값을 set객체로 생성
        return emitterList.entrySet().stream()
                //groupId로 시작하는 것들 모두 가져와서 map으로 만들어서 반환
                .filter(entry -> entry.getKey().startsWith(groupId.toString()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Override
    public void deleteById(String emitterId) {
        emitterList.remove(emitterId);
    }

    @Override
    public void deleteEmitterAllByGroupId(Long groupId) {
        emitterList.forEach(
                (key, emitter) -> {
                    //key가 groupId로 시작하는 얘들 전부 삭제
                    if(key.startsWith(groupId.toString())) {
                        emitterList.remove(key);
                    }
                }
        );
    }

    @Override
    public void deleteCacheAllByGroupId(Long groupId) {
        eventCache.forEach(
                (key, value) -> {
                    //key가 groupId로 시작하는 얘들 전부 삭제
                    if(key.startsWith(groupId.toString())) {
                        eventCache.remove(key);
                    }
                }
        );
    }
}
