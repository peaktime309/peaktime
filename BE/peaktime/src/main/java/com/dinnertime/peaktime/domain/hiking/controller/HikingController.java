package com.dinnertime.peaktime.domain.hiking.controller;

import com.dinnertime.peaktime.domain.hiking.service.HikingService;
import com.dinnertime.peaktime.domain.hiking.service.dto.request.EndHikingRequestDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.request.StartHikingRequestDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.response.*;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.util.CommonSwaggerResponse;
import com.dinnertime.peaktime.global.util.ResultDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/hikings")
public class HikingController {

    private final HikingService hikingService;

    @Operation(summary = "하이킹 시작", description = "하이킹 시작하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "하이킹을 시작하는데 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = StartHikingResponseDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "집중 시간은 최대 4시간을 초과 할 수 없습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "하이킹을 시작하는데 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping
    public ResponseEntity<?> startHiking(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody @Valid StartHikingRequestDto requestDto) {
        
        log.info("하이킹 시작");
        
        StartHikingResponseDto responseDto = hikingService.startHiking(userPrincipal.getUserId(),  requestDto);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "하이킹을 시작하는데 성공하였습니다.", responseDto));
    }

    @Operation(summary = "하이킹 종료", description = "하이킹 종료하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "하이킹을 종료하는데 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "컨텐츠 타입은 'program' 또는 'site' 여야 합니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "403", description = "자식 계정은 하이킹 중 종료 할 수 없습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "하이킹을 종료하는데 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @PutMapping("/{hiking-id}")
    public ResponseEntity<?> endHiking(@RequestBody @Valid EndHikingRequestDto requestDto, @PathVariable("hiking-id") Long hikingId) {
        hikingService.endHiking(requestDto, hikingId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "하이킹을 종료하는데 성공하였습니다."));
    }

    @Operation(summary = "하이킹 캘린더", description = "하이킹 캘린더 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "하이킹 캘린더를 조회하는데 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = HikingCalendarResponseDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "하이킹 캘린더를 조회하는데 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping("/calendar")
    public ResponseEntity<?> getCalendar(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        HikingCalendarResponseDto responseDto = hikingService.getCalendar(userPrincipal.getUserId());
        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "하이킹 캘린더를 조회하는데 성공하였습니다.", responseDto));
    }

    @Operation(summary = "하이킹 캘린더 상세 조회", description = "하이킹 캘린더 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "하이킹 캘린더 상세를 조회하는데 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = HikingCalendarDetailResponseDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "하이킹 캘린더 상세를 조회하는데 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping(value = "/calendar/date/{date}")
    public ResponseEntity<?> getCalendarByDate(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("date") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        HikingCalendarDetailResponseDto responseDto = hikingService.getCalendarByDate(userPrincipal.getUserId(), date);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "하이킹 내역 목록을 조회하는데 성공하였습니다.", responseDto));
    }

    @Operation(summary = "하이킹 내역 상세 조회", description = "하이킹 내역 상세 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "하이킹 내역 상세를 조회하는데 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = HikingDetailResponseDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "하이킹 내역 상세를 조회하는데 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping(value = "/{hiking-id}")
    public ResponseEntity<?> getHikingDetail(@PathVariable("hiking-id") Long hikingId) {

        HikingDetailResponseDto responseDto = hikingService.getHikingDetail(hikingId);


        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "하이킹 내역 상세를 조회하는데 성공하였습니다.", responseDto));
    }

    @Operation(summary = "하이킹 통계 내역 조회", description = "하이킹 통계 내역 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "하이킹 통계 내역을 조회하는데 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = HikingStatisticWrapperResponseDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "하이킹 통계 내역을 조회하는데 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping(value = "/statistics")
    public ResponseEntity<?> getHikingStatistics(@AuthenticationPrincipal UserPrincipal userPrincipal) {

        HikingStatisticResponseDto responseDto = hikingService.getHikingStatistic(userPrincipal.getUserId());

//        log.info(responseDto.toString());

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "하이킹 내역 상세를 조회하는데 성공하였습니다.", responseDto));
    }
}
