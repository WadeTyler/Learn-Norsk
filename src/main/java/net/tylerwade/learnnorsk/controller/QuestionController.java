package net.tylerwade.learnnorsk.controller;

import net.tylerwade.learnnorsk.lib.util.QuestionUtil;
import net.tylerwade.learnnorsk.model.Word;
import net.tylerwade.learnnorsk.model.question.CreateQuestionRequest;
import net.tylerwade.learnnorsk.model.question.Question;
import net.tylerwade.learnnorsk.repository.QuestionRepository;
import net.tylerwade.learnnorsk.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
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

    @PostMapping({"/", ""})
    public ResponseEntity<?> createQuestion(@RequestBody CreateQuestionRequest createQuestionRequest) {
        System.out.println("Attempting to create a question: \n" + createQuestionRequest);

        // Check for nulls
        if (createQuestionRequest.getTitle() == null || createQuestionRequest.getTitle().isEmpty()) {
            return new ResponseEntity<>("No title provided", HttpStatus.BAD_REQUEST);
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

        // Initialize Question
        Question newQuestion = new Question(createQuestionRequest.getType(), createQuestionRequest.getTitle());

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
                notFoundList.add(optionStrs[i]);
            }

            // If we have an answer
            if (questionUtil.checkExistsAndAddToList(answerStrs, answer, i, noImageList)) {
                notFoundList.add(answerStrs[i]);
            }

            // Increment
            i++;
        }

        // Check if any words were not found
        if (notFoundList.size() > 0) {
            return new ResponseEntity<>("Words not found: " + String.join(", ", notFoundList), HttpStatus.BAD_REQUEST);
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

    @GetMapping({"/", ""})
    public ResponseEntity<?> getAllQuestions() {
        return new ResponseEntity<>(questionRepo.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestion(@PathVariable int id) {
        Optional<Question> question = questionRepo.findById(id);
        if (!question.isPresent()) {
            return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(question.get(), HttpStatus.OK);
    }

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

    @GetMapping("/total")
    public ResponseEntity<?> getTotalQuestions() {
        return new ResponseEntity<>(questionRepo.count(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable int id) {

        if (!questionRepo.existsById(id)) {
            return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
        }

        questionRepo.deleteById(id);

        return new ResponseEntity<>("Question deleted", HttpStatus.OK);
    }
}

