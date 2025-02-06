package com.example.graphs.controller;

import com.example.graphs.controller.dto.*;
import com.example.graphs.jwt.JwtTokenUtil;
import com.example.graphs.repository.*;
import com.example.graphs.repository.entity.*;
import com.example.graphs.service.UserService;
import com.example.graphs.service.model.MyUser;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class MainController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LectureRepository lectureRepository;
    @Autowired
    private SectionRepository sectionRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private SubmissionFileRepository submissionFileRepository;
    @Autowired
    private SubmissionRepository submissionRepository;

    @CrossOrigin
    @GetMapping("/")
    public String home() {
        return "Hello world";
    }

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
    @PostMapping("/new-lecture")
    public Long addLecture(@RequestBody LectureEntity lecture, @CookieValue(value = "jwt") String token,
                             @CookieValue(value = "login") String login,
                             @CookieValue(value = "role") String role, HttpServletResponse response) {
        if(jwtTokenUtil.validateToken(token, login, role) && role.equals("TEACHER")) {
            return lectureRepository.save(lecture).getId();
        }
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }

    @CrossOrigin
    @PostMapping("/new-section")
    public Long addSection(@RequestBody SectionEntity section, @CookieValue(value = "jwt") String token,
                             @CookieValue(value = "login") String login,
                             @CookieValue(value = "role") String role, HttpServletResponse response) {
        if(jwtTokenUtil.validateToken(token, login, role) && role.equals("TEACHER")) {
            return sectionRepository.save(section).getId();
        }
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }

    @CrossOrigin
    @PostMapping("/new-task")
    public Long addTask(@RequestBody TaskEntity task, @CookieValue(value = "jwt") String token,
                             @CookieValue(value = "login") String login,
                             @CookieValue(value = "role") String role, HttpServletResponse response) {
        if(jwtTokenUtil.validateToken(token, login, role) && role.equals("TEACHER")) {
            return taskRepository.save(task).getId();
        }
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }

    @CrossOrigin
    @GetMapping("/all-lectures")
    public List<LectureEntity> getLectures() {
        return lectureRepository.findAll();
    }

    @CrossOrigin
    @GetMapping("/all-sections")
    public List<SectionEntity> getSections() {
        return sectionRepository.findAll();
    }

    @CrossOrigin
    @GetMapping("/all-tasks")
    public List<TaskEntity> getTasks() {
        return taskRepository.findAll();
    }

    @CrossOrigin
    @GetMapping("/user-task-submissions")
    public List<SubmissionResponseDto> getSubmissions(@CookieValue("jwt") String token,
                                                      @CookieValue("login") String login,
                                                      @CookieValue("role") String role,
                                                      @RequestParam Long taskId,
                                                      HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        if(role.equals("TEACHER")) {
            return submissionRepository.getByTaskId(taskId);
        }

        Long id = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        return submissionRepository.getUserTaskSubmissions(id, taskId);
    }

    @CrossOrigin
    @GetMapping("/user-task-submission-files")
    public List<SubmissionFileEntity> getSubmissionFiles(@CookieValue("jwt") String token,
                                                     @CookieValue("login") String login,
                                                     @CookieValue("role") String role,
                                                     @RequestParam Long taskId,
                                                     HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        if(role.equals("TEACHER")) {
            return submissionFileRepository.findAllByTaskId(taskId);
        }

        Long id = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        return submissionFileRepository.getUserTaskSubmissions(id, taskId);
    }

    @CrossOrigin
    @GetMapping("/task-scores")
    public List<TaskScoreDto> getTaskScores(@CookieValue("jwt") String token,
                                            @CookieValue("login") String login,
                                            @CookieValue("role") String role,
                                            HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("STUDENT")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        Long id = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        return submissionRepository.getTaskScores(id);
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
                    return "This user is already teacher";
                } else {
                    userRepository.updateRole(user.getId(), "TEACHER");
                    return "ok";
                }
            } catch (UsernameNotFoundException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return "User doesn't exist";
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

    @CrossOrigin
    @PostMapping("/add-submission-file")
    public Long addSubmissionFile(@CookieValue("jwt") String token,
                             @CookieValue("login") String login,
                             @CookieValue("role") String role,
                             @RequestBody SubmissionFileDto submissionFileDto,
                             HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("STUDENT")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        SubmissionEntity submission = submissionRepository.findById(submissionFileDto.getSubmissionId()).get();
        Long submissionAuthorId = submission.getStudentId();
        Long idFromToken = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        if(!submissionAuthorId.equals(idFromToken)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        if(submission.isChecked()) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return null;
        }

        return submissionFileRepository.save(new SubmissionFileEntity(submissionFileDto,
                                        jwtTokenUtil.getClaimFromToken(token,
                                                (claims) -> Long.valueOf(claims.get("id").toString())))).getId();
    }

    @CrossOrigin
    @PostMapping("/add-submission")
    public Long addSubmission(@CookieValue("jwt") String token,
                                @CookieValue("login") String login,
                                @CookieValue("role") String role,
                                @RequestBody SubmissionRequestDto submissionRequestDto,
                                HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("STUDENT")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        Long userId = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        return submissionRepository.save(new SubmissionEntity(submissionRequestDto.getTaskId(),
                                                              userId,
                                                              submissionRequestDto.getTryId())).getId();
    }

    @CrossOrigin
    @PutMapping("/set-score")
    public String setScore(@CookieValue("jwt") String token,
                           @CookieValue("login") String login,
                           @CookieValue("role") String role,
                           @RequestBody SetScoreDto setScoreDto, HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("TEACHER")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        SubmissionEntity submission = submissionRepository.findById(setScoreDto.getSubmissionId()).get();

        if(submission.isChecked()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return "Already checked";
        }

        submissionRepository.setScore(setScoreDto.getSubmissionId(), setScoreDto.getScore());
        return "ok";
    }

    @CrossOrigin
    @DeleteMapping("/delete-submission-file")
    public String deleteSubmissionFile(@CookieValue("jwt") String token,
                                  @CookieValue("login") String login,
                                  @CookieValue("role") String role,
                                  @RequestParam Long fileId, HttpServletResponse response) {
        if (!jwtTokenUtil.validateToken(token, login, role) || !role.equals("STUDENT")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        SubmissionFileEntity submissionFile = submissionFileRepository.findById(fileId).get();
        Long submissionAuthorId = submissionFile.getStudentId();
        Long idFromToken = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        if(!submissionAuthorId.equals(idFromToken)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        SubmissionEntity submission = submissionRepository.findById(submissionFile.getSubmissionId()).get();

        if(submission.isChecked()) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return null;
        }

        submissionFileRepository.deleteById(fileId);
        return "ok";
    }

    @CrossOrigin
    @DeleteMapping("/delete-submission")
    public String deleteSubmission(@CookieValue("jwt") String token,
                                       @CookieValue("login") String login,
                                       @CookieValue("role") String role,
                                       @RequestParam Long submissionId, HttpServletResponse response) {
        if (!jwtTokenUtil.validateToken(token, login, role) || !role.equals("STUDENT")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        SubmissionEntity submission = submissionRepository.findById(submissionId).get();
        Long submissionAuthorId = submission.getStudentId();
        Long idFromToken = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        if(!submissionAuthorId.equals(idFromToken)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        if(submission.isChecked()) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return null;
        }

        submissionRepository.deleteById(submissionId);
        return "ok";
    }
}
