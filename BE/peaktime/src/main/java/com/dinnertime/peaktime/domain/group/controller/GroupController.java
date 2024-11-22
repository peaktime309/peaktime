package com.dinnertime.peaktime.domain.group.controller;

import com.dinnertime.peaktime.domain.group.service.GroupService;
import com.dinnertime.peaktime.domain.group.service.dto.request.GroupCreateRequestDto;
import com.dinnertime.peaktime.domain.group.service.dto.request.GroupPutRequestDto;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupDetailResponseDto;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupListResponseDto;
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
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

//    그룹 전체 조회
    @Operation(summary = "그룹 전체 정보 조회", description = "루트 유저의 전체 그룹 정보 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "그룹 및 서브유저 전체 조회 성공하였습니다.",
                    content = @Content(schema = @Schema(implementation = GroupListResponseDto.class))),
            @ApiResponse(responseCode = "500", description = "그룹을 조회하는 데 실패하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping("")
    public ResponseEntity<?> getGroupList(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getUserId();

        GroupListResponseDto groupListResponseDto = groupService.getGroupListResponseDto(userId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "그룹 및 서브유저 전체 조회 성공했습니다.", groupListResponseDto));
    }

//    그룹 생성
    @Operation(summary = "그룹 생성", description = "유저가 가진 그룹 수와 그룹명 중복을 체크 후 그룹 생성")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "그룹을 생성하는 데 성공했습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "409", description = "중복된 그룹 이름입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "422", description = "최대 5개까지 그룹을 생성할 수 있습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "그룹을 생성하는 데 실패했습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping("")
    public ResponseEntity<?> postGroup(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody @Valid GroupCreateRequestDto requestDto) {
        Long userId = userPrincipal.getUserId();

        groupService.postGroup(userId, requestDto);
        GroupListResponseDto groupListResponseDto = groupService.getGroupListResponseDto(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ResultDto.res(HttpStatus.CREATED.value(), "그룹을 생성하는 데 성공했습니다.", groupListResponseDto));
    }

//    그룹 조회
    @Operation(summary = "그룹 단일 조회", description = "루트 유저의 그룹 단일 상세 정보 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "그룹을 조회하는 데 성공했습니다.",
                    content = @Content(schema = @Schema(implementation = GroupDetailResponseDto.class))),
            @ApiResponse(responseCode = "422", description = "존재하지 않는 그룹입니다",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "그룹을 조회하는 데 실패하였습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping("/{groupId}")
    public ResponseEntity<?> getGroupDetail(@PathVariable("groupId") Long groupId) {
        GroupDetailResponseDto groupDetailResponseDto = groupService.getGroupDetail(groupId);

        return ResponseEntity.status(HttpStatus.OK).body((ResultDto.res(HttpStatus.OK.value(), "그룹을 조회하는 데 성공했습니다.", groupDetailResponseDto)));
    }

//    그룹 수정
    @Operation(summary = "그룹 수정", description = "그룹의 title 혹은 preset 수정")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "그룹 정보를 수정하는 데 성공했습니다.",
                    content = @Content(schema = @Schema(implementation = GroupListResponseDto.class))),
            @ApiResponse(responseCode = "409", description = "중복된 그룹 이름입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "422", description = "존재하지 않는 그룹입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "그룹 정보를 수정하는 데 실패했습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @PutMapping("/{groupId}")
    public ResponseEntity<?> putGroup(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable("groupId") Long groupId, @RequestBody @Valid GroupPutRequestDto requestDto) {
        Long userId = userPrincipal.getUserId();

        groupService.putGroup(userId, groupId, requestDto);
        GroupListResponseDto groupListResponseDto = groupService.getGroupListResponseDto(userId);

        return ResponseEntity.status(HttpStatus.OK).body((ResultDto.res(HttpStatus.OK.value(), "그룹 정보를 수정하는 데 성공했습니다.", groupListResponseDto)));
    }

//    그룹 삭제
    @Operation(summary = "그룹 삭제", description = "그룹 및 그룹에 속한 모든 child 계정 삭제")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "그룹 정보를 삭제하는 데 성공했습니다.",
                    content = @Content(schema = @Schema(implementation = GroupListResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 그룹입니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "그룹을 삭제하는 데 실패했습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @DeleteMapping("/{groupId}")
    public ResponseEntity<?> deleteGroup(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable("groupId") Long groupId) {
        Long userId = userPrincipal.getUserId();
        groupService.deleteGroup(groupId);
        GroupListResponseDto groupListResponseDto = groupService.getGroupListResponseDto(userId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "그룹 정보를 삭제하는 데 성공했습니다.", groupListResponseDto));
    }
}
