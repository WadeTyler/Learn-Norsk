package net.tylerwade.learnnorsk.model.question;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter @Setter @ToString @NoArgsConstructor
public class CreateQuestionRequest  {

    private String title;
    private String type;
    private String options;
    private String answer;

}
