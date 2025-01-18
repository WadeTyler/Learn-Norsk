package net.tylerwade.learnnorsk.model.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class User {

    private @Id String id;
    private String firstName;
    private String lastName;
    @Column(unique = true)
    private String email;
    private String password;
    private String role;
    private String createdAt;

    public User(String firstName, String lastName, String email, String password) {
        // Create UUID
        this.id = UUID.randomUUID().toString();

        this.firstName = firstName;
        this.lastName = lastName;

        this.email = email;
        this.password = password;

        // Set Default Role
        this.role = "user";
        // Set Created At to now
        this.createdAt = createCreatedAt();
    }

    private String createCreatedAt() {
        return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(new Date()).toString();
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
