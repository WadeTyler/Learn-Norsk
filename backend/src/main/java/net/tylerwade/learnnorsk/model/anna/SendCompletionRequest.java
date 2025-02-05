package net.tylerwade.learnnorsk.model.anna;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor @Getter
@Setter
@ToString
public class SendCompletionRequest {
    private String content;
}
