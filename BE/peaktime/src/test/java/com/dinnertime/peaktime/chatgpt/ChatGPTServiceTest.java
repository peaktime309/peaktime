package com.dinnertime.peaktime.chatgpt;

import com.dinnertime.peaktime.global.util.chatgpt.ChatGPTRequest;
import com.dinnertime.peaktime.global.util.chatgpt.ChatGPTResponse;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.client.RestTemplate;

@SpringBootTest
@Slf4j
public class ChatGPTServiceTest {
    @Value("${openai.api.model}")
    private String model;

    @Value("${openai.api.url}")
    private String apiURL;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    @Qualifier("redisTemplate")
    private RedisTemplate<String, Object> redisTemplate;

    ChatGPTServiceTest(@Qualifier("openAiRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Test
    public void test() {
        String prompt = "안녕하세요.";
        ChatGPTRequest request = new ChatGPTRequest(model, prompt);
        ChatGPTResponse chatGPTResponse =  restTemplate.postForObject(apiURL, request, ChatGPTResponse.class);

        log.info(chatGPTResponse.getChoices().get(0).getMessage().getContent());

    }

    @Test
    public void redisTest() {
        String key = "rooting:" + 1;
        redisTemplate.opsForValue().set(key, "dsfsd");
    }

}
