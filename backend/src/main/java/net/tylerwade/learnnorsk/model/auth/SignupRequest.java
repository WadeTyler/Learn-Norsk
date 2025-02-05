package net.tylerwade.learnnorsk.model.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter @Setter
public class SignupRequest extends User {

    private String confirmPassword;

    public SignupRequest(String firstName, String lastName, String email, String password, String confirmPassword) {
        super(firstName, lastName, email, password);
        this.confirmPassword = confirmPassword;
    }
}
