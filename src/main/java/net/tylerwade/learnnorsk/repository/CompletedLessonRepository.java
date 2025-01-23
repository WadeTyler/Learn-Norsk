package net.tylerwade.learnnorsk.repository;

import net.tylerwade.learnnorsk.model.lesson.CompletedLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompletedLessonRepository  extends JpaRepository<CompletedLesson, Integer> {

    public List<CompletedLesson> findByUserId(String userId);

    public Optional<CompletedLesson> findByUserIdAndLessonId(String userId, int lessonId);

    @Query(value = "SELECT c.lessonId FROM CompletedLesson c WHERE c.userId = ?1")
    public List<Integer> getCompletedLessonIdsByUserId(String user);

}
