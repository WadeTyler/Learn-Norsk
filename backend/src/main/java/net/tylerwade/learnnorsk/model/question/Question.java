package net.tylerwade.learnnorsk.model.question;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import net.tylerwade.learnnorsk.lib.util.TimeUtil;
import net.tylerwade.learnnorsk.model.lesson.Lesson;
import net.tylerwade.learnnorsk.model.word.Word;

import java.util.List;

@Entity @Getter @Setter @NoArgsConstructor @ToString
public class Question {

    @Id
    @GeneratedValue
    private Integer id;

    @Column(name = "lesson_id", nullable = false)
    private Integer lessonId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", insertable = false, updatable = false)
    @JsonIgnore
    private Lesson lesson;

    @Column(nullable = false)
    private Integer questionNumber;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String title;

    private String createdAt = TimeUtil.createCreatedAt();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "question_option",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "word_id")
    )
    @OrderColumn(name = "list_index")
    private List<Word> options;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "question_answer",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "word_id")
    )
    @OrderColumn(name = "list_index")
    private List<Word> answer;

    public Question(Integer lessonId, String type, String title, Integer questionNumber) {
        this.lessonId = lessonId;
        this.type = type;
        this.title = title;
        this.questionNumber = questionNumber;
    }

    public Question(Integer id, Integer lessonId, Integer questionNumber, String type, String title, List<Word> options, List<Word> answer) {
        this.id = id;
        this.lessonId = lessonId;
        this.questionNumber = questionNumber;
        this.type = type;
        this.title = title;
        this.options = options;
        this.answer = answer;
    }
}
