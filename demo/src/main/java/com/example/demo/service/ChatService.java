package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.HashMap;

@Service
public class ChatService {

    private final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private final RestTemplate restTemplate = new RestTemplate();

    public String generateResponse(String userPrompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "qwen2.5:1.5b");
        requestBody.put("prompt", "You are a helpful AI assistant for a Learning Management System. User says: " + userPrompt);
        requestBody.put("stream", false);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(OLLAMA_URL, entity, Map.class);
            if (response.getBody() != null && response.getBody().containsKey("response")) {
                return (String) response.getBody().get("response");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, I am currently offline. Please make sure Ollama is running!";
        }

        return "I could not generate a response right now.";
    }
}
