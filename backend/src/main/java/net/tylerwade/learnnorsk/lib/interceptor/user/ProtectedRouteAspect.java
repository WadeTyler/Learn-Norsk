package net.tylerwade.learnnorsk.lib.interceptor.user;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import net.tylerwade.learnnorsk.lib.exception.UnauthorizedException;
import net.tylerwade.learnnorsk.lib.util.AuthUtil;
import net.tylerwade.learnnorsk.model.auth.User;
import net.tylerwade.learnnorsk.repository.UserRepository;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Aspect
@Component
public class ProtectedRouteAspect {

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private UserRepository userRepo;

    @Pointcut("@annotation(net.tylerwade.learnnorsk.lib.interceptor.user.ProtectedRoute)")
    public void protectedRouteMethods() {
        // empty
    }

    // This runs before the method execution
    @Before("protectedRouteMethods()")
    public void checkAuthToken() throws Exception {
        Cookie[] cookies = request.getCookies();
        String authToken = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("authToken")) {
                    authToken = cookie.getValue();
                    break;
                }
            }
        }

        String id = authUtil.getIdFromToken(authToken);

        if (authToken == null || id == null) {
            throw new UnauthorizedException("Unauthorized access.");
        }

        // Find user
        Optional<User> user = userRepo.findById(id);
        if (user.isEmpty()) {
            throw new UnauthorizedException("Unauthorized access.");
        }


        String role = user.get().getRole();

        if (!role.equals("user") && !role.equals("admin")) {
            throw new UnauthorizedException("Unauthorized access.");
        }


        request.setAttribute("user", user.get());
    }

}

