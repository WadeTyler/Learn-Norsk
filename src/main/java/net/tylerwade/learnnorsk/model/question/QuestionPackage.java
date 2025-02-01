package net.tylerwade.learnnorsk.model.question;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import net.tylerwade.learnnorsk.model.word.Word;
import java.util.List;

@Getter @Setter @ToString @NoArgsConstructor
public class QuestionPackage extends Question {

    private List<Word> titleWords;

    public QuestionPackage(Question question) {
       super(question.getId(), question.getType(), question.getTitle(), question.getOptions(), question.getAnswer());
    }

}
