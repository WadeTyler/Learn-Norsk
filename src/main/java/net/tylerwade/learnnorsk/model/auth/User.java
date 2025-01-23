package net.tylerwade.learnnorsk.model.auth;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.learnnorsk.lib.util.TimeUtil;
import net.tylerwade.learnnorsk.model.lesson.Lesson;
import org.hibernate.annotations.ColumnDefault;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class User {

    private @Id String id = UUID.randomUUID().toString();
    private String firstName;
    private String lastName;
    @Column(unique = true)
    private String email;
    private String password;
    private int level = 1;
    private int experience = 0;
    private String role = "user";
    private String createdAt = TimeUtil.createCreatedAt();

    public User(String firstName, String lastName, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }


    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role='" + role + '\'' +
                ", createdAt='" + createdAt + '\'' +
                '}';
    }
}
