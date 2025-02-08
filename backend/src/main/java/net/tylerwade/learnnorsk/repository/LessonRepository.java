package net.tylerwade.learnnorsk.repository;

import net.tylerwade.learnnorsk.model.lesson.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {

    Optional<Lesson> findByIdAndSectionId(Integer id, Integer sectionId);

    Optional<Lesson> findBySectionIdAndLessonNumber(Integer sectionId, Integer lessonNumber);

    Optional<Lesson> findBySectionIdAndTitleIgnoreCase(Integer sectionId, String title);

    List<Lesson> findBySectionIdOrderByLessonNumber(Integer sectionId);
}
