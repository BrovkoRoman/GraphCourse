package com.example.graphs.controller;

import com.example.graphs.controller.dto.UserDto;
import com.example.graphs.controller.dto.UserResponseDto;
import com.example.graphs.jwt.JwtTokenUtil;
import com.example.graphs.repository.UserRepository;
import com.example.graphs.service.UserService;
import com.example.graphs.service.model.MyUser;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @PostMapping("/new-user")
    @CrossOrigin
    public UserResponseDto addUser(@RequestBody UserDto userDto, HttpServletResponse response) {
        try {
            userService.getUserByUsername(userDto.getLogin());
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return null;
        } catch(UsernameNotFoundException e) {
            userService.addUser(new MyUser(userDto.getLogin(),
                    userDto.getPassword(), (userDto.getLogin().equals("admin") ? "TEACHER" : "STUDENT")));
            MyUser user = userService.getUserByUsername(userDto.getLogin());

            return new UserResponseDto(jwtTokenUtil.generateToken(user),
                    user.getRole());
        }

    }
    @PostMapping("/loginPage")
    @CrossOrigin
    public UserResponseDto login(@RequestBody UserDto userDto, HttpServletResponse response) {
        try {
            MyUser user = userService.getUserByUsername(userDto.getLogin());

            if(passwordEncoder.matches(userDto.getPassword(),
                    user.getPassword())) {
                return new UserResponseDto(jwtTokenUtil.generateToken(user),
                        user.getRole());
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return null;
            }
        } catch(UsernameNotFoundException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return null;
        }
    }
    @CrossOrigin
    @PutMapping("/make-teacher") // teachers can give role "teacher" to other users
    public String makeTeacher(@CookieValue("jwt") String token,
                              @CookieValue("login") String login,
                              @CookieValue("role") String role,
                              @RequestBody String otherUserLogin, HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("TEACHER")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        } else {
            try {
                MyUser user = userService.getUserByUsername(otherUserLogin);

                if(user.getRole().equals("TEACHER")) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    return "Пользователь уже является преподавателем";
                } else {
                    userRepository.updateRole(user.getId(), "TEACHER");
                    return "Пользователю предоставлены права преподавателя";
                }
            } catch (UsernameNotFoundException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return "Нет такого пользователя";
            }
        }
    }
    @CrossOrigin
    @GetMapping("/check-role") // check whether student is promoted to teacher and if yes, return new jwt
    public String checkRole(@CookieValue("jwt") String token,
                            @CookieValue("login") String login,
                            @CookieValue("role") String role,
                            HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        try {
            MyUser user = userService.getUserByUsername(login);

            if(user.getRole().equals("TEACHER")) {
                return jwtTokenUtil.generateToken(user);
            }

            return null;
        } catch (UsernameNotFoundException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return null;
        }
    }
}
