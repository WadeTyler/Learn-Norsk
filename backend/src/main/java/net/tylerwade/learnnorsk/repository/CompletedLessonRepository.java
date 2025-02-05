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

    public Optional<CompletedLesson> findByUserIdAndLessonIdAndSectionId(String userId, int lessonId, int sectionId);

    List<CompletedLesson> getCompletedLessonByUserId(String userId);

}
