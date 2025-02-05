package net.tylerwade.learnnorsk.model.section;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import net.tylerwade.learnnorsk.lib.util.TimeUtil;
import net.tylerwade.learnnorsk.model.lesson.Lesson;

import java.util.List;

@Entity @Getter @Setter @ToString @NoArgsConstructor
public class Section {

    @Id @GeneratedValue
    private int id;
    private String title;
    private int sectionNumber;
    private int experienceReward;
    private String createdAt = TimeUtil.createCreatedAt();

    @ManyToMany
    @JoinTable(
            name = "section_lesson",
            joinColumns = @JoinColumn(name = "section_id"),
            inverseJoinColumns = @JoinColumn(name = "lesson_id")
    )
    private List<Lesson> lessons;

    public Section(String title, int sectionNumber, int experienceReward, List<Lesson> lessons) {
        this.title = title;
        this.sectionNumber = sectionNumber;
        this.experienceReward = experienceReward;
        this.lessons = lessons;
    }
}
