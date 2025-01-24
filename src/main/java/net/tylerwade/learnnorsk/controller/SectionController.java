package net.tylerwade.learnnorsk.controller;

import jakarta.servlet.http.HttpServletRequest;
import net.tylerwade.learnnorsk.lib.middleware.AdminRoute;
import net.tylerwade.learnnorsk.lib.middleware.ProtectedRoute;
import net.tylerwade.learnnorsk.lib.util.LessonUtil;
import net.tylerwade.learnnorsk.lib.util.UserUtil;
import net.tylerwade.learnnorsk.model.auth.User;
import net.tylerwade.learnnorsk.model.lesson.CheckAnswersRequest;
import net.tylerwade.learnnorsk.model.lesson.Lesson;
import net.tylerwade.learnnorsk.model.question.Question;
import net.tylerwade.learnnorsk.model.section.CreateSectionRequest;
import net.tylerwade.learnnorsk.model.section.Section;
import net.tylerwade.learnnorsk.repository.LessonRepository;
import net.tylerwade.learnnorsk.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController @RequestMapping("/api/sections")
public class SectionController {

    @Autowired
    private SectionRepository sectionRepo;

    @Autowired
    private LessonRepository lessonRepo;

    @Autowired
    private UserUtil userUtil;

    @Autowired
    private LessonUtil lessonUtil;

    @AdminRoute
    @PostMapping({"", "/"})
    public ResponseEntity<?> createSection(@RequestBody CreateSectionRequest createSectionRequest) {

        String title = createSectionRequest.getTitle();
        int sectionNumber = createSectionRequest.getSectionNumber();
        int experienceReward = createSectionRequest.getExperienceReward();
        int[] lessonIds = createSectionRequest.getLessonIds();

        // Check fields
        if (title == null || title.isEmpty() || sectionNumber == 0 || experienceReward == 0 || lessonIds.length == 0) {
            return new ResponseEntity<>("Invalid Request: All fields required.", HttpStatus.BAD_REQUEST);
        }

        // Check valid lessons and add to list
        List<Lesson> lessons = new ArrayList<>();
        List<Integer> notFoundLessons = new ArrayList<>();

        for (Integer lessonId : lessonIds) {
            Optional<Lesson> lesson = lessonRepo.findById(lessonId);
            if (lesson.isEmpty()) {
                notFoundLessons.add(lessonId);
            } else {
                lessons.add(lesson.get());
            }
        }

        // Check if any lessons were not found
        if (notFoundLessons.size() > 0) {
            return new ResponseEntity<>("Lessons not found: " + notFoundLessons, HttpStatus.NOT_FOUND);
        }

        // Create the section
        Section newSection = new Section(title, sectionNumber, experienceReward, lessons);
        sectionRepo.save(newSection);

        return new ResponseEntity<>(newSection, HttpStatus.CREATED);
    }

    @ProtectedRoute
    @GetMapping({"", "/"})
    public ResponseEntity<?> getAllSections() {
        List<Section> sections = sectionRepo.findAllOrderBySectionNumberAsc();

        // Remove questions from each lesson
        for (Section section : sections) {
            List<Lesson> lessons = section.getLessons();
            for (Lesson lesson : lessons) {
                lesson.setQuestions(null);
            }
        }

        return new ResponseEntity<>(sections, HttpStatus.OK);
    }

    @ProtectedRoute
    @GetMapping("/{id}")
    public ResponseEntity<?> getSectionById(@PathVariable int id) {
        Optional<Section> section = sectionRepo.findById(id);
        if (section.isEmpty()) return new ResponseEntity<>("Section not found", HttpStatus.NOT_FOUND);

        // Remove questions from each lesson
        for (Lesson lesson : section.get().getLessons()) {
            lesson.setQuestions(null);
        }

        return new ResponseEntity<>(section.get(), HttpStatus.OK);
    }

    @ProtectedRoute
    @GetMapping("/total")
    public ResponseEntity<?> getTotalSections() {
        return new ResponseEntity<>(sectionRepo.count(), HttpStatus.OK);
    }

    @ProtectedRoute
    @GetMapping("/{sectionId}/lessons/{lessonId}/questions")
    public ResponseEntity<?> getQuestionsInLessonInSection(@PathVariable int sectionId, @PathVariable int lessonId) {

        // Check valid section id
        Optional<Section> section = sectionRepo.findById(sectionId);
        if (section.isEmpty()) return new ResponseEntity<>("Section not found.", HttpStatus.NOT_FOUND);

        // Check valid lesson id
        Optional<Lesson> lesson = lessonRepo.findById(lessonId);
        if (lesson.isEmpty()) return new ResponseEntity<>("Lesson not found", HttpStatus.NOT_FOUND);

        // Check lesson is in section
        boolean isLessonInSection = false;
        for (Lesson l : section.get().getLessons()) {
            if (l.getId() == lesson.get().getId()) {
                isLessonInSection = true;
                break;
            }
        }

        if (!isLessonInSection) return new ResponseEntity<>("Requested Lesson is not in that section", HttpStatus.BAD_REQUEST);

        // TODO: Add check to see if user had unlocked that lesson

        return new ResponseEntity<>(lesson.get().getQuestions(), HttpStatus.OK);
    }

    @AdminRoute
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSection(@PathVariable int id) {

        if (id == -99) {
            sectionRepo.deleteAll();
            return new ResponseEntity<>("All sections deleted.", HttpStatus.OK);
        }

        Optional<Section> section = sectionRepo.findById(id);
        if (section.isEmpty()) return new ResponseEntity<>("Section not found", HttpStatus.NOT_FOUND);
        sectionRepo.delete(section.get());
        return new ResponseEntity<>("Section '" + id + "' deleted.", HttpStatus.OK);
    }

    @ProtectedRoute
    @PostMapping("/{sectionId}/lessons/{lessonId}/check-answers")
    public ResponseEntity<?> checkAnswers(@PathVariable int sectionId, @PathVariable int lessonId, @RequestBody List<CheckAnswersRequest> userAnswers, HttpServletRequest request) throws Exception {
        User user = (User) request.getAttribute("user");

        // Check section exists
        Optional<Section> sectionOptional = sectionRepo.findById(sectionId);
        if (sectionOptional.isEmpty()) return new ResponseEntity<>("Invalid Section Id", HttpStatus.BAD_REQUEST);

        // Check lesson exists
        Optional<Lesson> lessonOptional = lessonRepo.findById(lessonId);
        if (lessonOptional.isEmpty()) return new ResponseEntity<>("Invalid Lesson Id", HttpStatus.BAD_REQUEST);


        // Check lesson is in section
        boolean exists = false;
        for (Lesson lesson : sectionOptional.get().getLessons()) {
            if (lesson.getId() == lessonOptional.get().getId()) {
                exists = true;
                break;
            }
        }
        if (!exists) return new ResponseEntity<>("Lesson does not match section", HttpStatus.BAD_REQUEST);

        List<Question> questions = lessonOptional.get().getQuestions();

        // Check length matching
        if (userAnswers.size() != questions.size()) {
            return new ResponseEntity<>("Question and Answer size does not match", HttpStatus.BAD_REQUEST);
        }

        // TODO: Write more efficient. Current is O(n^3), although this isn't THAT bad since questions are light, but can do better
        // Check each question's answers match
        for (CheckAnswersRequest userAnswer : userAnswers) {

            boolean matchFound = false;

            // Find matching question
            for (Question question : questions) {
                if (question.getId() == userAnswer.getQuestionId()) {
                    matchFound = true;
                    // Check answers size
                    if (question.getAnswer().size() != userAnswer.getAnswer().size()) return new ResponseEntity<>("A question is incorrect", HttpStatus.BAD_REQUEST);

                    // Check answer order
                    for (int i = 0; i < question.getAnswer().size(); i++) {
                        if (question.getAnswer().get(i).getId() != userAnswer.getAnswer().get(i).getId()) {
                            return new ResponseEntity<>("A question is incorrect", HttpStatus.BAD_REQUEST);
                        }
                    }
                }
            }

            if (!matchFound) {
                return new ResponseEntity<>("A question does not have a matching answer", HttpStatus.BAD_REQUEST);
            }
        }

        // Increase user's experience
        userUtil.addExperience(user.getId(), lessonOptional.get().getExperienceReward());

        // Add lesson completion to the user's stats
        lessonUtil.addCompletedLesson(user.getId(), sectionId, lessonOptional.get().getId());

        // TODO: Add check if the user has completed the section

        return new ResponseEntity<>("Answers are all correct!", HttpStatus.OK);
    }

}
