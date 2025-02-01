package net.tylerwade.learnnorsk.controller;

import jakarta.servlet.http.HttpServletRequest;
import net.tylerwade.learnnorsk.lib.interceptor.user.ProtectedRoute;
import net.tylerwade.learnnorsk.lib.openai.OpenAIService;
import net.tylerwade.learnnorsk.model.anna.ChatMessage;
import net.tylerwade.learnnorsk.model.anna.SendCompletionRequest;
import net.tylerwade.learnnorsk.model.auth.User;
import net.tylerwade.learnnorsk.repository.anna.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/anna")
public class AnnaController {

    // TODO: Add a way to use full current message session


    @Autowired
    OpenAIService openAIService;

    @Autowired
    ChatMessageRepository chatMessageRepo;

    @PostMapping("/send-completion")
    @ProtectedRoute
    public ResponseEntity<?> sendCompletion(@RequestBody SendCompletionRequest request, HttpServletRequest httpServletRequest) {
        User user = (User) httpServletRequest.getAttribute("user");
        System.out.println(request.getContent());

        String response = openAIService.fetchMessage(request.getContent());

        ChatMessage chatMessage = new ChatMessage(request.getContent(), response, user.getId());

        chatMessageRepo.save(chatMessage);

        return new ResponseEntity<>(chatMessage, HttpStatus.OK);
    }
}
