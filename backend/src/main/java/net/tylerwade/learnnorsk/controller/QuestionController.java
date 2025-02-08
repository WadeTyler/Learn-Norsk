package net.tylerwade.learnnorsk.controller;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.learnnorsk.lib.interceptor.admin.AdminRoute;
import net.tylerwade.learnnorsk.lib.interceptor.user.ProtectedRoute;
import net.tylerwade.learnnorsk.lib.util.QuestionUtil;
import net.tylerwade.learnnorsk.model.lesson.Lesson;
import net.tylerwade.learnnorsk.model.word.Word;
import net.tylerwade.learnnorsk.model.question.CreateQuestionRequest;
import net.tylerwade.learnnorsk.model.question.Question;
import net.tylerwade.learnnorsk.repository.LessonRepository;
import net.tylerwade.learnnorsk.repository.QuestionRepository;
import net.tylerwade.learnnorsk.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepo;

    @Autowired
    private WordRepository wordRepo;

    @Autowired
    private QuestionUtil questionUtil;

    @Autowired
    private LessonRepository lessonRepository;


    // TODO: update createQuestion to fit new refactor
    @AdminRoute
    @PostMapping({"/", ""})
    public ResponseEntity<?> createQuestion(@RequestBody CreateQuestionRequest createQuestionRequest) {

        // Check for nulls
        if (createQuestionRequest.getLessonId() == null) {
            return new ResponseEntity<>("Lesson id is required.", HttpStatus.BAD_REQUEST);
        }

        if (createQuestionRequest.getTitle() == null || createQuestionRequest.getTitle().isEmpty()) {
            return new ResponseEntity<>("No title provided", HttpStatus.BAD_REQUEST);
        }

        if (createQuestionRequest.getQuestionNumber() == null || createQuestionRequest.getQuestionNumber() == 0) {
            return new ResponseEntity<>("Question Number not provided. Min 1", HttpStatus.BAD_REQUEST);
        }

        String type = createQuestionRequest.getType();
        if (type == null || type.isEmpty()) {
            return new ResponseEntity<>("No type provided", HttpStatus.BAD_REQUEST);
        }

        boolean isSentenceTyping = type.equals("sentence-typing");
        boolean isImageChoice = type.equals("image-choice");

        if (!isSentenceTyping && (createQuestionRequest.getOptions() == null || createQuestionRequest.getOptions().isEmpty())) {
            return new ResponseEntity<>("No options provided", HttpStatus.BAD_REQUEST);
        }

        if (createQuestionRequest.getAnswer() == null || createQuestionRequest.getAnswer().isEmpty()) {
            return new ResponseEntity<>("No answers provided", HttpStatus.BAD_REQUEST);
        }


        // Check type is valid
        if (!type.equals("image-choice") && !type.equals("sentence-forming") && !type.equals("sentence-typing")) {
            return new ResponseEntity<>("Invalid type", HttpStatus.BAD_REQUEST);
        }

        // Check lesson exists
        if (!lessonRepository.existsById(createQuestionRequest.getLessonId())) {
            return new ResponseEntity<>("Lesson not found.", HttpStatus.NOT_FOUND);
        }

        // Check question number already taken in lesson
        Optional<Question> existsByNumber = questionRepo.findByLessonIdAndQuestionNumber(createQuestionRequest.getLessonId(), createQuestionRequest.getQuestionNumber());

        if (existsByNumber.isPresent()) {
            return new ResponseEntity<>("Question Number already taken.", HttpStatus.BAD_REQUEST);
        }

        // Initialize Question
        Question newQuestion = new Question(createQuestionRequest.getLessonId(), type, createQuestionRequest.getTitle(), createQuestionRequest.getQuestionNumber());

        // Convert strings to arrays
        String[] optionStrs = !isSentenceTyping ? createQuestionRequest.getOptions().split(" ") : new String[0];
        String[] answerStrs = createQuestionRequest.getAnswer().split(" ");

        // Check if answers is longer than options
        if (!isSentenceTyping && answerStrs.length > optionStrs.length) {
            return new ResponseEntity<>("Answer cannot be longer than options.", HttpStatus.BAD_REQUEST);
        }

        // Add options and answers
        List<Word> options = new ArrayList<>();
        List<Word> answer = new ArrayList<>();

        // List used to keep track of words that were not found
        List<String> notFoundList = new ArrayList<>();

        // List used to keep track of words that don't have images
        List<String> noImageList = new ArrayList<>();

        // Iterate over both arrays and add to lists
        int i = 0;
        while (i < optionStrs.length || i < answerStrs.length) {

            // If we have an option
            if (questionUtil.checkExistsAndAddToList(optionStrs, options, i, noImageList)) {
                if (!notFoundList.contains(optionStrs[i])) {
                    notFoundList.add(optionStrs[i]);
                }
            }

            // If we have an answer
            if (questionUtil.checkExistsAndAddToList(answerStrs, answer, i, noImageList)) {
                if (!notFoundList.contains(answerStrs[i])) {
                    notFoundList.add(answerStrs[i]);
                }
            }

            // Increment
            i++;
        }

        // Check if any words were not found
        if (notFoundList.size() > 0) {
            WordsNotFoundError wordsNotFoundError = new WordsNotFoundError("Some or all Words were not found.", notFoundList);

            return new ResponseEntity<>(wordsNotFoundError, HttpStatus.BAD_REQUEST);
        }

        // Check if any words don't have images
        if (isImageChoice && noImageList.size() > 0) {
            return new ResponseEntity<>("Words without images: " + String.join(", ", noImageList), HttpStatus.BAD_REQUEST);
        }

        // Check if answer is in options. (Only check if type is not sentence-typing)
        if (!isSentenceTyping && !questionUtil.isAnswerInOptions(options, answer)) {
            return new ResponseEntity<>("Answer must be in options", HttpStatus.BAD_REQUEST);
        }

        // Set options and answers
        newQuestion.setOptions(options);
        newQuestion.setAnswer(answer);

        // Save question
        questionRepo.save(newQuestion);


        System.out.println("Question created.");

        return new ResponseEntity<>(newQuestion, HttpStatus.CREATED);

    }

    @AdminRoute
    @GetMapping({"/", ""})
    public ResponseEntity<?> getAllQuestions() {
        return new ResponseEntity<>(questionRepo.findAll(), HttpStatus.OK);
    }

    @ProtectedRoute
    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestion(@PathVariable int id) {
        Optional<Question> question = questionRepo.findById(id);
        if (!question.isPresent()) {
            return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(question.get(), HttpStatus.OK);
    }

    @AdminRoute
    @GetMapping("/search")
    public ResponseEntity<?> searchQuestionsByTitleAndId(@RequestParam String query) {
        System.out.println(query);

        if (query == null || query.isEmpty()) {
            return new ResponseEntity<>(questionRepo.findAll(), HttpStatus.OK);
        }

        List<Question> questions = questionRepo.findByTitleContainingIgnoreCase(query);

        if (questionUtil.isInteger(query)) {
            int queryId = Integer.parseInt(query);
            if (queryId > 0) {
                Optional<Question> question = questionRepo.findById(queryId);
                if (question.isPresent()) {
                    questions.add(question.get());
                }
            }
        }

        return new ResponseEntity<>(questions, HttpStatus.OK);

    }

    @AdminRoute
    @GetMapping("/total")
    public ResponseEntity<?> getTotalQuestions() {
        return new ResponseEntity<>(questionRepo.count(), HttpStatus.OK);
    }

    @AdminRoute
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable int id) {

        if (id == -99) {
            questionRepo.deleteAll();
            return new ResponseEntity<>("All questions deleted", HttpStatus.OK);
        }

        if (!questionRepo.existsById(id)) {
            return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
        }

        questionRepo.deleteById(id);

        return new ResponseEntity<>("Question '" + id + "' deleted", HttpStatus.OK);
    }

    // Change question number
    @AdminRoute
    @PatchMapping("/{id}/change-question-number/{value}")
    public ResponseEntity<?> changeQuestionNumber(@PathVariable Integer id, @PathVariable Integer value) {
        Optional<Question> questionOptional = questionRepo.findById(id);
        if (questionOptional.isEmpty()) {
            return new ResponseEntity<>("Question '" + id + "' not found.", HttpStatus.NOT_FOUND);
        }

        Question question = questionOptional.get();
        
        // Check if a question in the same section already has the target number
        Optional<Question> existingNumberQuestion = questionRepo.findByLessonIdAndQuestionNumber(question.getLessonId(), value);

        if (existingNumberQuestion.isPresent() && !Objects.equals(existingNumberQuestion.get().getId(), question.getId())) {
            return new ResponseEntity<>("Question with the number '" + value + "' already taken.", HttpStatus.BAD_REQUEST);
        }

        // Change Question
        question.setQuestionNumber(value);

        // Save question
        questionRepo.save(question);

        return new ResponseEntity<>(question, HttpStatus.OK);
    }



    // UTIL CLASSES

    @Getter @Setter @NoArgsConstructor
    class WordsNotFoundError {
        private String message;
        private String errorType = "WORDS_NOT_FOUND";
        private List<String> notFoundWords;

        public WordsNotFoundError(String message, List<String> notFoundWords) {
            this.message = message;
            this.notFoundWords = notFoundWords;
        }
    }


}

