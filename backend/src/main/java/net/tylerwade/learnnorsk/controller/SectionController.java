package net.tylerwade.learnnorsk.controller;

import jakarta.servlet.http.HttpServletRequest;
import net.tylerwade.learnnorsk.lib.interceptor.admin.AdminRoute;
import net.tylerwade.learnnorsk.lib.interceptor.user.ProtectedRoute;
import net.tylerwade.learnnorsk.lib.util.LessonUtil;
import net.tylerwade.learnnorsk.lib.util.QuestionUtil;
import net.tylerwade.learnnorsk.lib.util.UserUtil;
import net.tylerwade.learnnorsk.model.auth.User;
import net.tylerwade.learnnorsk.model.lesson.CheckAnswersRequest;
import net.tylerwade.learnnorsk.model.lesson.Lesson;
import net.tylerwade.learnnorsk.model.question.Question;
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
    @Autowired
    private QuestionUtil questionUtil;


    // Create a section
    @AdminRoute
    @PostMapping({"", "/"})
    public ResponseEntity<?> createSection(@RequestBody Section createRequest) {

        StringBuilder badRequestMessage = new StringBuilder("");

        // Check for values
        if (createRequest.getTitle() == null || createRequest.getTitle().isEmpty()) {
            badRequestMessage.append("Title is required.\n");
        }

        if (createRequest.getSectionNumber() == null || createRequest.getSectionNumber() == 0) {
            badRequestMessage.append("Section number is required. Min 1.\n");
        }

        if (createRequest.getExperienceReward() == null || createRequest.getExperienceReward() == 0) {
            badRequestMessage.append("Experience Reward required. Min 1.\n");
        }

        // Return bad request if any missing or invalid values.
        if (!badRequestMessage.isEmpty()) {
            return new ResponseEntity<>(badRequestMessage, HttpStatus.BAD_REQUEST);
        }

        // Check if title already exists or if section number already taken
        Optional<Section> existingSectionByNumber = sectionRepo.findBySectionNumber(createRequest.getSectionNumber());

        if (existingSectionByNumber.isPresent()) {
            badRequestMessage.append("Section Number already taken.\n");
        }

        Optional<Section> existingSectionByTitle = sectionRepo.findByTitleIgnoreCase(createRequest.getTitle());

        if (existingSectionByTitle.isPresent()) {
            badRequestMessage.append("Section title already exists.\n");
        }

        if (!badRequestMessage.isEmpty()) {
            return new ResponseEntity<>(badRequestMessage, HttpStatus.BAD_REQUEST);
        }

        // Save section
        sectionRepo.save(createRequest);

        return new ResponseEntity<>(createRequest, HttpStatus.CREATED);
    }

    @ProtectedRoute
    @GetMapping({"", "/"})
    public ResponseEntity<?> getAllSections() {
        List<Section> sections = sectionRepo.findAllOrderBySectionNumberAsc();

        // Set all questions to null
        for (Section section : sections) {
            for (Lesson lesson : section.getLessons()) {
                lesson.setQuestions(null);
            }
        }

        return new ResponseEntity<>(sections, HttpStatus.OK);
    }

    @AdminRoute
    @GetMapping("/{id}")
    public ResponseEntity<?> getSectionById(@PathVariable int id) {
        Optional<Section> sectionOptional = sectionRepo.findById(id);
        if (sectionOptional.isEmpty()) return new ResponseEntity<>("Section not found", HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(sectionOptional.get(), HttpStatus.OK);
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
        Optional<Lesson> lesson = lessonRepo.findByIdAndSectionId(lessonId, sectionId);

        // Check exists
        if (lesson.isEmpty()) {
            return new ResponseEntity<>("Lesson not found", HttpStatus.NOT_FOUND);
        }

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

        // Check lesson exists
        Optional<Lesson> lessonOptional = lessonRepo.findByIdAndSectionId(lessonId, sectionId);
        if (lessonOptional.isEmpty()) return new ResponseEntity<>("Lesson not found.", HttpStatus.NOT_FOUND);

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
