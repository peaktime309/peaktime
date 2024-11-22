package com.dinnertime.peaktime.domain.summary.controller;

import com.dinnertime.peaktime.domain.summary.service.SummaryFacade;
import com.dinnertime.peaktime.domain.summary.service.dto.request.SaveSummaryRequestDto;
import com.dinnertime.peaktime.domain.summary.service.dto.response.CreateSummaryResponseDto;
import com.dinnertime.peaktime.domain.summary.service.dto.response.SummaryDetailResponseDto;
import com.dinnertime.peaktime.domain.summary.service.dto.response.SummaryWrapperResponseDto;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/summaries")
@RequiredArgsConstructor
public class SummaryController {

    private final SummaryFacade summaryFacade;

    // 요약 저장
    @Operation(summary = "gpt 요약 내용 저장하기", description = "요약내용 저장하기")
    @ApiResponses(value ={
            @ApiResponse(responseCode = "200", description = "요청된 요약 내용 저장에 성공했습니다.",
            content=@Content(schema = @Schema(implementation = CreateSummaryResponseDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "요청된 요약 내용 저장에 실패했습니다.",
            content=@Content(schema = @Schema(implementation = ResultDto.class))
            ),
    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping()
    public ResponseEntity<?> createSummary(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody SaveSummaryRequestDto requestDto) {

        log.info("createSummary 메서드가 호출되었습니다.");
        log.info("요약 생성 : " + requestDto.toString());

        CreateSummaryResponseDto responseDto = summaryFacade.createSummary(requestDto, userPrincipal.getUserId());

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "요약 생성에 성공했습니다.", responseDto));

    }


    // 요약 삭제
    @Operation(summary = "저장된 요약 삭제하기", description = "요약 내용 삭제하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "요약 내용 삭제에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "요약 내용 삭제에 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )

    })
    @CommonSwaggerResponse.CommonResponses
    @DeleteMapping("/{summaryId}")
    public ResponseEntity<?> deleteSummary(@PathVariable Long summaryId) {

        log.info("deleteSummary  메서드가 호출되었습니다.");

        summaryFacade.deleteSummary(summaryId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"요약 내용 삭제에 성공했습니다."));
    }


    // 요약 리스트 조회
    @Operation(summary = "요약 리스트 조회", description = "화면 진입 시 요약의 리스트를 확인함")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "요약 리스트 조회에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = SummaryWrapperResponseDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "요약 리스트 조회에 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping
    public ResponseEntity<?> getSummaryTitles (
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("page") int page) {
        log.info("getSummaryTitles 메서드가 호출되었습니다.");

        SummaryWrapperResponseDto responseDto = summaryFacade.getSummaryList(userPrincipal.getUserId(), page);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"요약 리스트 조회에 성공했습니다.", responseDto));
    }


    // 요약 디테일 조회
    @Operation(summary = "요약 상세 조회", description = "요약 리스트 내 타이틀 클릭시 발생하는 상세 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "요약 상세 조회에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = SummaryDetailResponseDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "요약 상세 조회에 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping("/{summaryId}")
    public ResponseEntity<?> getSummaryDetail (@PathVariable("summaryId") Long summaryId) {
        log.info("getSummaryDetail 메서드가 호출되었습니다.");

        SummaryDetailResponseDto responseDto = summaryFacade.getSummaryDetail(summaryId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"요약 상세 조회에 성공했습니다.", responseDto));
    }
}
