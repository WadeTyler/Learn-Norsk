package net.tylerwade.learnnorsk.model.lesson;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @NoArgsConstructor @ToString
public class CreateLessonRequest extends Lesson {

    private int[] questionIds;

}
