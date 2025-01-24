package net.tylerwade.learnnorsk.lib.util;

import net.tylerwade.learnnorsk.model.lesson.CompletedLesson;
import net.tylerwade.learnnorsk.repository.CompletedLessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class LessonUtil {


    @Autowired
    CompletedLessonRepository completedLessonRepo;

    public void addCompletedLesson(String userId, int sectionId, int lessonId) {
        Optional<CompletedLesson> completedLessonOptional = completedLessonRepo.findByUserIdAndLessonIdAndSectionId(userId, lessonId, sectionId);
        if (completedLessonOptional.isPresent()) return;

        CompletedLesson newCompletedLesson = new CompletedLesson(userId, sectionId, lessonId);
        completedLessonRepo.save(newCompletedLesson);
    }

}