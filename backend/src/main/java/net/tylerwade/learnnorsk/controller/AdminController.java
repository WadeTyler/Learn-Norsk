package net.tylerwade.learnnorsk.controller;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import net.tylerwade.learnnorsk.lib.interceptor.admin.AdminRoute;
import net.tylerwade.learnnorsk.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {


    @Autowired
    SectionRepository sectionRepo;

    @Autowired
    private WordRepository wordRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private CompletedLessonRepository completedLessonRepository;

    @AdminRoute
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData() {

        long totalUsers = userRepository.count();
        long totalSections = sectionRepo.count();
        long totalLessons = lessonRepository.count();
        long totalQuestions = questionRepository.count();
        long totalWords = wordRepository.count();
        long totalCompletedLessons = completedLessonRepository.count();
        long totalAdmins = userRepository.findUserByRoleIsAdmin().size();

        DashboardData data = new DashboardData(totalUsers, totalSections, totalLessons, totalQuestions, totalWords, totalCompletedLessons, totalAdmins);

        return new ResponseEntity<>(data, HttpStatus.OK);
    }


    @Getter @Setter @ToString @NoArgsConstructor
    class DashboardData {
        private long totalUsers;
        private long totalSections;
        private long totalLessons;
        private long totalQuestions;
        private long totalWords;
        private long totalCompletedLessons;
        private long totalAdmins;

        public DashboardData(long totalUsers, long totalSections, long totalLessons, long totalQuestions, long totalWords, long totalCompletedLessons, long totalAdmins) {
            this.totalUsers = totalUsers;
            this.totalSections = totalSections;
            this.totalLessons = totalLessons;
            this.totalQuestions = totalQuestions;
            this.totalWords = totalWords;
            this.totalCompletedLessons = totalCompletedLessons;
            this.totalAdmins = totalAdmins;
        }
    }

}
