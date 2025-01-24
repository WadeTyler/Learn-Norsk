package net.tylerwade.learnnorsk.lib.util;

import net.tylerwade.learnnorsk.model.auth.User;
import net.tylerwade.learnnorsk.repository.LessonRepository;
import net.tylerwade.learnnorsk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserUtil {

    @Autowired
    UserRepository userRepo;

    @Autowired
    LessonRepository lessonRepo;

    public void addExperience(String id, int exp) throws Exception{
        Optional<User> user = userRepo.findById(id);
        if (user.isEmpty()) throw new Exception("User not found while adding exp");

        user.get().setExperience(
                user.get().getExperience() + exp
        );

        userRepo.save(user.get());
    }
}
