package com.dinnertime.peaktime.domain.schedule.controller;

import com.dinnertime.peaktime.domain.schedule.service.ScheduleService;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.util.CommonSwaggerResponse;
import com.dinnertime.peaktime.global.util.ResultDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/schedules")
public class ScheduleController {
    private final ScheduleService scheduleService;

    //타입을 TEXT_EVENT_STREAM_VALUE 명시해야 서버가 클라어언트에 메시지 스트림을 전송한다는 것을 명시하여 연결 유지 가능
    //lastEventId sse 연결이 끊어졌을 경우 마지막 이벤트 아이디
    @Operation(summary = "SSE 구독", description = "SSE 구독하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "구독하는데 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "구독하는데 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping(value = "", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestHeader(value = "LAST-EVENT-ID", required = false, defaultValue = "") String lastEventId
    ) {
        log.info("구독");
        //구독 하기
        return scheduleService.subScribe(userPrincipal.getUserId(), lastEventId);
    }
}
