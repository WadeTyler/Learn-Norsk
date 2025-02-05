package net.tylerwade.learnnorsk.lib.openai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class OpenAIService {

    private final RestTemplate restTemplate;
    private final String URL = "https://api.openai.com/v1/chat/completions";
    @Value("${OPENAI_API_KEY}")
    private String API_KEY;



    @Autowired
    public OpenAIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String fetchMessage(String content) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Authorization", "Bearer " + API_KEY);
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        String model = "gpt-4o";

        String developerPrompt = "You are Anna. You are a Norwegian Language Assistant that answers questions from users learning Norwegian online on a platform called Learn Norsk. Please respond with a friendly, helpful, and encouraging style. Always primarily speak in english unless otherwise requested by the user.";

        String messages = "[ " +
                "{" +
                "\"role\": \"developer\", " +
                "\"content\": \"" + developerPrompt + "\"" +
                "}, ";

        String userMessage = "{" +
                "\"role\": \"user\", " +
                "\"content\": \"" + content + "\"" +
                "}";
        messages += userMessage + " ]";

        String requestBody = "{\"model\": \"" + model + "\", \"messages\": " + messages + "}";

        HttpEntity<String> request = new HttpEntity<String>(requestBody, httpHeaders);
        ResponseEntity<String> response = restTemplate.exchange(URL, HttpMethod.POST, request, String.class);

        // Parse response
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            return jsonResponse.get("choices").get(0).get("message").get("content").asText();
        } catch (Exception e) {
            return "Something went wrong";
        }
    }

}
