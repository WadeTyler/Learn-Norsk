package net.tylerwade.learnnorsk.controller;

import jakarta.servlet.http.HttpServletRequest;
import net.tylerwade.learnnorsk.lib.interceptor.admin.AdminRoute;
import net.tylerwade.learnnorsk.lib.interceptor.user.ProtectedRoute;
import net.tylerwade.learnnorsk.lib.util.LessonUtil;
import net.tylerwade.learnnorsk.lib.util.UserUtil;
import net.tylerwade.learnnorsk.model.auth.User;
import net.tylerwade.learnnorsk.model.lesson.CompletedLesson;
import net.tylerwade.learnnorsk.model.lesson.CreateLessonRequest;
import net.tylerwade.learnnorsk.model.lesson.Lesson;
import net.tylerwade.learnnorsk.model.question.Question;
import net.tylerwade.learnnorsk.repository.CompletedLessonRepository;
import net.tylerwade.learnnorsk.repository.LessonRepository;
import net.tylerwade.learnnorsk.repository.QuestionRepository;
import net.tylerwade.learnnorsk.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private SectionRepository sectionRepository;

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
    public ResponseEntity<?> createLesson(@RequestBody Lesson createLessonRequest) {


        StringBuilder badRequestMessage = new StringBuilder("");

        // Check for missing or invalid attributes
        if (createLessonRequest.getSectionId() == null) {
            badRequestMessage.append("Section id is required.\n");
        }

        if (createLessonRequest.getLessonNumber() == null || createLessonRequest.getLessonNumber() == 0) {
            badRequestMessage.append("Lesson Number required. Min 1.\n");
        }

        if (createLessonRequest.getTitle() == null || createLessonRequest.getTitle().isEmpty()) {
            badRequestMessage.append("Title is required.\n");
        }

        if (createLessonRequest.getDescription() == null || createLessonRequest.getDescription().isEmpty()) {
            badRequestMessage.append("Description is required.\n");
        }

        if (createLessonRequest.getExperienceReward() == null || createLessonRequest.getExperienceReward() == 0) {
            badRequestMessage.append("Experience reward is required. Min 1\n");
        }

        if (!badRequestMessage.isEmpty()) {
            return new ResponseEntity<>(badRequestMessage, HttpStatus.BAD_REQUEST);
        }

        // Check section exists
        if (!sectionRepository.existsById(createLessonRequest.getSectionId())) {
            return new ResponseEntity<>("Section does not exists.", HttpStatus.NOT_FOUND);
        }

        // Check lesson number or lesson title taken in the same section
        Optional<Lesson> existingByLessonNumber = lessonRepo.findBySectionIdAndLessonNumber(createLessonRequest.getSectionId(), createLessonRequest.getLessonNumber());

        if (existingByLessonNumber.isPresent()) {
            badRequestMessage.append("Lesson number already taken.\n");
        }

        Optional<Lesson> existingByTitle = lessonRepo.findBySectionIdAndTitleIgnoreCase(createLessonRequest.getSectionId(), createLessonRequest.getTitle());

        if (existingByTitle.isPresent()) {
            badRequestMessage.append("Lesson with title already taken.");
        }

        if (!badRequestMessage.isEmpty()) {
            return new ResponseEntity<>(badRequestMessage, HttpStatus.BAD_REQUEST);
        }


        // Create and save lesson
        lessonRepo.save(createLessonRequest);

        return new ResponseEntity<>(createLessonRequest, HttpStatus.CREATED);
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

        List<CompletedLesson> completedLessons = completedLessonRepo.getCompletedLessonByUserId(user.getId());
        return new ResponseEntity<>(completedLessons, HttpStatus.OK);

    }


    @AdminRoute
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLesson(@PathVariable Integer id, @RequestBody Lesson updatedRequest) {
        Optional<Lesson> lessonOptional = lessonRepo.findById(id);

        if (lessonOptional.isEmpty()) {
            return new ResponseEntity<>("Lesson not found.", HttpStatus.NOT_FOUND);
        }

        Lesson lesson = lessonOptional.get();

        if (updatedRequest.getTitle() == null || updatedRequest.getTitle().isEmpty()) {
            return new ResponseEntity<>("Title is required.", HttpStatus.BAD_REQUEST);
        }

        if (updatedRequest.getDescription() == null || updatedRequest.getDescription().isEmpty()) {
            return new ResponseEntity<>("Description is required.", HttpStatus.BAD_REQUEST);
        }

        if (updatedRequest.getLessonNumber() == null || updatedRequest.getLessonNumber() <= 0) {
            return new ResponseEntity<>("Lesson Number is required. Min 1", HttpStatus.BAD_REQUEST);
        }

        if (updatedRequest.getExperienceReward() == null || updatedRequest.getExperienceReward() <= 0) {
            return new ResponseEntity<>("Experience reward is required. Min 1", HttpStatus.BAD_REQUEST);
        }

        // Check if title already taken
        Optional<Lesson> existingByTitle = lessonRepo.findBySectionIdAndTitleIgnoreCase(lesson.getSectionId(), updatedRequest.getTitle());
        if (existingByTitle.isPresent() && !Objects.equals(existingByTitle.get().getId(), lesson.getId())) {
            return new ResponseEntity<>("Lesson with that title already exists in section.", HttpStatus.BAD_REQUEST);
        }

        // Check if Lesson number already taken
        Optional<Lesson> existingByLessonNumber = lessonRepo.findBySectionIdAndLessonNumber(lesson.getSectionId(), updatedRequest.getLessonNumber());
        if (existingByLessonNumber.isPresent() && !Objects.equals(existingByLessonNumber.get().getId(), lesson.getId())) {
            return new ResponseEntity<>("Lesson number already taken.", HttpStatus.BAD_REQUEST);
        }

        // Update values
        lesson.setTitle(updatedRequest.getTitle());
        lesson.setDescription(updatedRequest.getDescription());
        lesson.setLessonNumber(updatedRequest.getLessonNumber());
        lesson.setExperienceReward(updatedRequest.getExperienceReward());

        // Save updated lesson
        lessonRepo.save(lesson);

        return new ResponseEntity<>(lesson, HttpStatus.OK);
    }


}