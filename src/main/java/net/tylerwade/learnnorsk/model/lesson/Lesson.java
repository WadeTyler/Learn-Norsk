package net.tylerwade.learnnorsk.model.lesson;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.learnnorsk.lib.util.TimeUtil;
import net.tylerwade.learnnorsk.model.question.Question;

import java.util.List;

@Entity @Getter @Setter @NoArgsConstructor
public class Lesson {

    @Id @GeneratedValue
    private int id;
    private int lessonNumber;
    private int experienceReward;
    private String createdAt = TimeUtil.createCreatedAt();

    @ManyToMany
    @JoinTable(
            name = "lesson_question",
            joinColumns = @JoinColumn(name = "lesson_id"),
            inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions;

    public Lesson(int lessonNumber, int experienceReward, List<Question> questions) {
        this.lessonNumber = lessonNumber;
        this.experienceReward = experienceReward;
        this.questions = questions;
    }
}
