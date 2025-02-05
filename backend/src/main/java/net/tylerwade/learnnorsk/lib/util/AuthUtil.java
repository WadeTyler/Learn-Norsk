package net.tylerwade.learnnorsk.lib.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Component
public class AuthUtil {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Value("${JWT_AUTH_SECRET}")
    private String authSecret;

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public boolean verifyPassword(String password, String encodedPassword) {
        return passwordEncoder.matches(password, encodedPassword);
    }

    public Cookie createAuthTokenCookie(String id) throws Exception {
        String authToken = createJwtCookie(id);

        Cookie cookie = new Cookie("authToken", authToken);
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        cookie.setSecure(true);
        cookie.setHttpOnly(true);
        cookie.setPath("/");

        return cookie;
    }

    public Cookie createLogoutCookie() {
        Cookie cookie = new Cookie("authToken", "");
        cookie.setMaxAge(0);
        cookie.setSecure(true);
        cookie.setHttpOnly(true);
        cookie.setPath("/");

        return cookie;
    }

    private String createJwtCookie(String id) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(authSecret);
            String token = JWT.create()
                    .withIssuer("learnnorsk")
                    .withSubject(id)
                    .sign(algorithm);
            return token;
        } catch (Exception e) {
            throw e;
        }
    }

    public String getIdFromToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(authSecret);
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .withIssuer("learnnorsk")
                    .build()
                    .verify(token);
            return decodedJWT.getSubject();
        } catch (Exception e) {
            return null;
        }
    }

}
