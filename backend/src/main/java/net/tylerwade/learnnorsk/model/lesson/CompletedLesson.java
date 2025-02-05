package net.tylerwade.learnnorsk.model.lesson;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity @Getter @Setter @NoArgsConstructor @ToString
public class CompletedLesson {

    @Id @GeneratedValue
    private int id;
    private String userId;
    private int sectionId;
    private int lessonId;

    public CompletedLesson(String userId, int sectionId, int lessonId) {
        this.userId = userId;
        this.sectionId = sectionId;
        this.lessonId = lessonId;
    }
}
