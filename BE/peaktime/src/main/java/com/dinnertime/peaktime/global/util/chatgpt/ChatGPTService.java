package com.dinnertime.peaktime.global.util.chatgpt;

import com.dinnertime.peaktime.domain.summary.service.dto.request.SaveSummaryRequestDto;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.RedisService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.*;
import java.util.concurrent.TimeUnit;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatGPTService {

    private static final int MAX_TOKEN = 1000;
    private static final int MAX_GPT_REQUEST_PER_DAY = 3;
    private final RedisService redisService;

    @Value("${openai.api.model}")
    private String gptModel;

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiURL;

    public String getGPTResult(SaveSummaryRequestDto requestDto, Long userId) {

        // 1. 유저당 하루 gpt 사용 횟수(3번) 처리하기

        Integer count = redisService.getGPTcount(userId);
        count = count == null ? 0 : count; // 초기 횟수가 null이면 0으로 처리

        // 유저마다 하루 gpt 요청 최대 3번
        if (count >= MAX_GPT_REQUEST_PER_DAY) {
            throw new CustomException(ErrorCode.MAX_GPT_REQUEST_TODAY);
        }

        // 요청 본문 준비
        // 모든 형태는 hashmap 형태로 담아서 처리한다.
        // 1. requestBody 요청 부분에 Model 설정하기
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", gptModel);

        // 2. message 부분에 role, content 형식의 역할 부여 추가해야 함
        // role : 모델의 초기 성격이나 반응을 처음으로 생성할 때 system, 질의 응답을 하는 user, 응답을 받은 내용을 처리하는 assistant
        // 한글로 작성해도 되지만, 명확한 의미 부여를 위해 영어로 작성하는 것으로 권장됨

        // system 초기 설정
        String systemContent = "You are a helpful assistant specialized in summarizing texts. When additional keywords are provided, include related information in the summary.";
        Map<String, Object> systemMessage = new HashMap<>();

        systemMessage.put("role", "system");
        systemMessage.put("content", systemContent);


        // description으로 받아오는 문자열 추가 설정도 가능

        // 3. 추가 키워드 받아와서 프롬포트 문자열 생성하기

        // user : 질의를 진행하는 실제 템플릿 양식(질문 양식 작성)
        Map<String, Object> userMessage = new HashMap<>();

        try {
            String originContent = requestDto.getContent();

            // ObjectMapper를 사용하여 JSON 객체 생성
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode json = mapper.createObjectNode();

            // JSON 노드에 원본 텍스트 추가 (줄바꿈 포함)
            json.put("text", originContent);

            // JSON 문자열 출력 (자동으로 이스케이프 처리됨)
            String jsonString = mapper.writeValueAsString(json);


            String userContent = "Please summarize the following text, incorporating the additional keywords provided even if they are not explicitly mentioned in the text. If the keywords are absent, provide relevant information based on related context.\n\nText to summarize:\n"
                    + jsonString + "\n\nAdditional keywords: " + Arrays.toString(requestDto.getKeywords()) + "\n\n그리고 한글로 작성해줘.";
            log.info(userContent);
            userMessage.put("role", "user");
            userMessage.put("content", userContent);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.FAILED_PROMPT_TO_JSON);
        }

        // role system, user binding해서 requestBody에 추가하기
        requestBody.put("messages", List.of(systemMessage, userMessage));
        requestBody.put("max_tokens", MAX_TOKEN);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            // post 요청으로 보내기 위해 restTemplate 활용
            ResponseEntity<JsonNode> response = restTemplate.exchange(apiURL, HttpMethod.POST, requestEntity, JsonNode.class);
            log.info("GPT STATUS CODE는? " + response.getStatusCode());
            if (response.getStatusCode() == HttpStatus.OK) {
                // response 받아서 처리하기
                JsonNode responseBody = response.getBody();
                log.info(Objects.requireNonNull(response.getBody()).toString());
                // 응답 내용 추출하기
                JsonNode messageNode = responseBody.path("choices").get(0).path("message").path("content");
                String text = messageNode.asText();

                // redis count 늘리기
                redisService.setGPTIncrement(userId);
                return text;
            }
        } catch (Exception e) {
            throw new CustomException(ErrorCode.GPT_BAD_REQUEST);
        }
        return "";

    }
}

