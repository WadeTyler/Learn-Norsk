package net.tylerwade.learnnorsk.model.lesson;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.learnnorsk.lib.util.TimeUtil;
import net.tylerwade.learnnorsk.model.question.Question;
import net.tylerwade.learnnorsk.model.section.Section;

import java.util.List;

@Entity @Getter @Setter @NoArgsConstructor
public class Lesson {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(nullable = false)
    private Integer id;
    @Column(name = "section_id", nullable = false)
    private Integer sectionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", insertable = false, updatable = false)
    @JsonIgnore
    private Section section;

    @Column(name = "lesson_number", nullable = false)
    private Integer lessonNumber;

    private String title;
    private String description;
    private Integer experienceReward;

    @OneToMany(mappedBy = "lesson", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true)
    @OrderBy("questionNumber ASC")
    private List<Question> questions;

    private String createdAt = TimeUtil.createCreatedAt();

    public Lesson(Integer sectionId, String title, String description, Integer lessonNumber, Integer experienceReward) {
        this.sectionId = sectionId;
        this.title = title;
        this.description = description;
        this.lessonNumber = lessonNumber;
        this.experienceReward = experienceReward;
    }
}