package net.tylerwade.learnnorsk.lib.util;

import net.tylerwade.learnnorsk.model.word.Word;
import net.tylerwade.learnnorsk.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Component
public class QuestionUtil {

    @Autowired
    private WordRepository wordRepo;

    // Checks if the word exists in norsk
    public boolean checkExistsAndAddToList(String[] strs, List<Word> list, int i, List<String> noImageList) {
        if (i < strs.length) {
            // Check if the word exists
            Optional<Word> existingWord = wordRepo.findByNorskIgnoreCase(strs[i]);
            if (!existingWord.isPresent()) {
                return true;
            }

            // If the word does not have an image add it to the noImageList
            if (existingWord.get().getImage() == null || existingWord.get().getImage().isEmpty()) {
                noImageList.add(strs[i]);
            }

            // Add to list
            list.add(existingWord.get());
        }
        return false;
    }

    // Check if answer is in the options
    public boolean isAnswerInOptions(List<Word> options, List<Word> answers) {
        // Use a hashmap to store the number of times each option appears.
        HashMap<String, Integer> optionCount = new HashMap<>();

        // convert options to the hashmap
        for (Word option : options) {
            optionCount.putIfAbsent(option.getNorsk(), 0);
            optionCount.put(option.getNorsk(), optionCount.get(option.getNorsk()) + 1);
        }

        for (Word answer : answers) {
            // Check if it is even the option list
            if (!optionCount.containsKey(answer.getNorsk())) {
                return false;
            }

            // Check if the answer is still available
            int count = optionCount.get(answer.getNorsk());
            if (count == 0) {
                return false;
            }

            // Reduce the count
            optionCount.put(answer.getNorsk(), count - 1);
        }

        return true;

    }

    public boolean isInteger(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        try {
            Integer.parseInt(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
