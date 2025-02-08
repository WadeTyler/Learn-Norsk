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
    private Integer id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(nullable = false, unique = true)
    private Integer sectionNumber;

    private Integer experienceReward;

    @OneToMany(mappedBy = "section", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Lesson> lessons;

    private String createdAt = TimeUtil.createCreatedAt();

    public Section(String title, Integer sectionNumber, Integer experienceReward) {
        this.title = title;
        this.sectionNumber = sectionNumber;
        this.experienceReward = experienceReward;
    }
}
