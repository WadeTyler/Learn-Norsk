package net.tylerwade.learnnorsk.controller;

import net.tylerwade.learnnorsk.lib.middleware.AdminRoute;
import net.tylerwade.learnnorsk.lib.middleware.ProtectedRoute;
import net.tylerwade.learnnorsk.model.lesson.Lesson;
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
        List<Section> sections = sectionRepo.findAll();

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

}
