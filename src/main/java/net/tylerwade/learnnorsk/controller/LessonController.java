package net.tylerwade.learnnorsk.controller;

import jakarta.servlet.http.HttpServletRequest;
import net.tylerwade.learnnorsk.lib.middleware.AdminRoute;
import net.tylerwade.learnnorsk.lib.middleware.ProtectedRoute;
import net.tylerwade.learnnorsk.lib.util.AuthUtil;
import net.tylerwade.learnnorsk.lib.util.LessonUtil;
import net.tylerwade.learnnorsk.lib.util.UserUtil;
import net.tylerwade.learnnorsk.model.Word;
import net.tylerwade.learnnorsk.model.auth.User;
import net.tylerwade.learnnorsk.model.lesson.CheckAnswersRequest;
import net.tylerwade.learnnorsk.model.lesson.CreateLessonRequest;
import net.tylerwade.learnnorsk.model.lesson.Lesson;
import net.tylerwade.learnnorsk.model.question.Question;
import net.tylerwade.learnnorsk.repository.CompletedLessonRepository;
import net.tylerwade.learnnorsk.repository.LessonRepository;
import net.tylerwade.learnnorsk.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepo;

    @Autowired
    private QuestionRepository questionRepo;

    @Autowired
    private CompletedLessonRepository completedLessonRepo;

    @Autowired
    LessonUtil lessonUtil;

    @Autowired
    UserUtil userUtil;
    @Autowired
    private CompletedLessonRepository completedLessonRepository;

    /**
     * Creates a new lesson.
     *
     * @param createLessonRequest The request body containing lesson details.
     * @return A ResponseEntity containing the created lesson and HTTP status code.
     */
    @AdminRoute
    @PostMapping({"/", ""})
    public ResponseEntity<?> createLesson(@RequestBody CreateLessonRequest createLessonRequest) {

        String title = createLessonRequest.getTitle();
        String description = createLessonRequest.getDescription();
        int lessonNumber = createLessonRequest.getLessonNumber();
        int experienceReward = createLessonRequest.getExperienceReward();
        int[] questionIds = createLessonRequest.getQuestionIds();

        if (title.isEmpty() || title == null || description.isEmpty() || description == null || lessonNumber == 0 || experienceReward == 0 || questionIds.length == 0) {
            return ResponseEntity.badRequest().body("Invalid request");
        }

        // Check if questionIds are valid and generate list of questions
        List<Question> questions = new ArrayList<>();
        List<Integer> notFoundQuestionIds = new ArrayList<>();

        for (int questionId : questionIds) {
            Optional<Question> question = questionRepo.findById(questionId);
            if (question.isEmpty()) {
                notFoundQuestionIds.add(questionId);
            } else {
                questions.add(question.get());
            }
        }

        // If any questionIds are not found, return not found
        if (!notFoundQuestionIds.isEmpty()) {
            return new ResponseEntity<>("Questions not found: " + notFoundQuestionIds, HttpStatus.NOT_FOUND);
        }

        // Create lesson
        Lesson newLesson = new Lesson(title, description, lessonNumber, experienceReward, questions);
        lessonRepo.save(newLesson);

        return new ResponseEntity<>(newLesson, HttpStatus.CREATED);
    }

    /**
     * Retrieves all lessons.
     *
     * @return A ResponseEntity containing a list of all lessons and HTTP status code.
     */
    @AdminRoute
    @GetMapping({"/", ""})
    public ResponseEntity<?> getAllLessons() {
        return new ResponseEntity<>(lessonRepo.findAll(), HttpStatus.OK);
    }

    /**
     * Retrieves a lesson by its ID.
     *
     * @param id The ID of the lesson to retrieve.
     * @return A ResponseEntity containing the lesson if found, or an error message and HTTP status code if not found.
     */
    @ProtectedRoute
    @GetMapping("/{id}")
    public ResponseEntity<?> getLessonById(@PathVariable int id) {
        Optional<Lesson> lesson = lessonRepo.findById(id);
        if (lesson.isEmpty()) return new ResponseEntity<>("Lesson not found", HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(lesson.get(), HttpStatus.OK);
    }

    /**
     * Retrieves the total number of lessons.
     *
     * @return A ResponseEntity containing the total number of lessons and HTTP status code.
     */
    @AdminRoute
    @GetMapping("/total")
    public ResponseEntity<?> getTotalLessons() {
        return new ResponseEntity<>(lessonRepo.count(), HttpStatus.OK);
    }

    /**
     * Deletes a lesson by its ID.
     *
     * @param id The ID of the lesson to delete. If the ID is -99, all lessons are deleted.
     * @return A ResponseEntity containing a success message and HTTP status code.
     */
    @AdminRoute
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable int id) {

        if (id == -99) {
            lessonRepo.deleteAll();
            return new ResponseEntity<>("All lessons deleted", HttpStatus.OK);
        }

        Optional<Lesson> lesson = lessonRepo.findById(id);
        if (lesson.isEmpty()) {
            return new ResponseEntity<>("Lesson not found", HttpStatus.NOT_FOUND);
        }

        lessonRepo.delete(lesson.get());
        return new ResponseEntity<>("Lesson '" + id + "'deleted", HttpStatus.OK);
    }

    @ProtectedRoute
    @GetMapping("/completed")
    public ResponseEntity<?> getCompletedLessons(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        List<Integer> completedLessons = completedLessonRepo.getCompletedLessonIdsByUserId(user.getId());
        return new ResponseEntity<>(completedLessons, HttpStatus.OK);

    }

    @ProtectedRoute
    @PostMapping("/{id}/check-answers")
    public ResponseEntity<?> checkAnswers(@PathVariable int id, @RequestBody List<CheckAnswersRequest> userAnswers, HttpServletRequest request) throws Exception {
        System.out.println("Checking user answers");

        User user = (User) request.getAttribute("user");

        Optional<Lesson> lessonOptional = lessonRepo.findById(id);
        if (lessonOptional.isEmpty()) return new ResponseEntity<>("Invalid Lesson Id", HttpStatus.BAD_REQUEST);
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
        lessonUtil.addCompletedLesson(user.getId(), lessonOptional.get().getId());

        // TODO: Add check if the user has completed the section

        return new ResponseEntity<>("Answers are all correct!", HttpStatus.OK);
    }

}