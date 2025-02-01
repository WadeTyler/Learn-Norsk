package net.tylerwade.learnnorsk.model.anna;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import net.tylerwade.learnnorsk.lib.util.TimeUtil;

@Getter @Setter @NoArgsConstructor @ToString @Entity
public class ChatMessage {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(columnDefinition = "TEXT")
    private String userMessage;
    @Column(columnDefinition = "TEXT")
    private String aiMessage;
    private String userId;
    private String timestamp = TimeUtil.createCreatedAt();

    public ChatMessage(String userMessage, String aiMessage, String userId) {
        this.userMessage = userMessage;
        this.aiMessage = aiMessage;
        this.userId = userId;
    }
}
