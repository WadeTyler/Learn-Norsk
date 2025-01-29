package net.tylerwade.learnnorsk.model.lesson;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import net.tylerwade.learnnorsk.model.word.Word;

import java.util.List;

@Getter @Setter @NoArgsConstructor @ToString
public class CheckAnswersRequest {

    private int questionId;
    private List<Word> answer;

    @Override
    public String toString() {
        return "CheckAnswersRequest{" +
                "questionId=" + questionId +
                ", answer=" + answer.toString() +
                '}';
    }
}
