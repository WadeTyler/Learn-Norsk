package net.tylerwade.learnnorsk.repository;

import net.tylerwade.learnnorsk.model.question.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByTitleContainingIgnoreCase(String query);

    Optional<Question> findByLessonIdAndQuestionNumber(Integer lessonId, Integer questionNumber);
}
