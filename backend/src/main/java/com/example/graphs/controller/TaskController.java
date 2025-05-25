package com.example.graphs.controller;

import com.example.graphs.controller.dto.*;
import com.example.graphs.jwt.JwtTokenUtil;
import com.example.graphs.repository.*;
import com.example.graphs.repository.entity.*;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@RestController
@AllArgsConstructor
public class TaskController {
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TaskVariantRepository taskVariantRepository;
    @Autowired
    private StudentTaskVariantRepository studentTaskVariantRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubmissionFileRepository submissionFileRepository;
    @Autowired
    private SubmissionRepository submissionRepository;
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
    @PostMapping("/new-task-variant")
    public Long addTaskVariant(@RequestBody TaskVariantEntity taskVariant,
                               @CookieValue(value = "jwt") String token,
                               @CookieValue(value = "login") String login,
                               @CookieValue(value = "role") String role, HttpServletResponse response) {
        if(jwtTokenUtil.validateToken(token, login, role) && role.equals("TEACHER")) {
            return taskVariantRepository.save(taskVariant).getId();
        }
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }
    @CrossOrigin
    @GetMapping("/all-task-variants")
    public List<TaskVariantEntity> allTaskVariants(@RequestParam Long taskId) {
        return taskVariantRepository.findAllByTaskId(taskId);
    }
    @CrossOrigin
    @GetMapping("/student-task-variant")
    public TaskVariantDto studentTaskVariant(@RequestParam Long taskId,
                                                @CookieValue(value = "jwt") String token,
                                                @CookieValue(value = "login") String login,
                                                @CookieValue(value = "role") String role,
                                                HttpServletResponse response) {
        if (!jwtTokenUtil.validateToken(token, login, role) || !role.equals("STUDENT")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        Optional<UserEntity> user = userRepository.findByLogin(login);

        if(user.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }

        Optional<Long> variantOptional = studentTaskVariantRepository
                .getStudentTaskVariant(user.get().getId(), taskId);

        long variantIndex;

        if(variantOptional.isPresent()) {
            variantIndex = variantOptional.get();
        }
        else {
            Long numberOfVariants = taskVariantRepository.countVariants(taskId);
            Random rnd = new Random();
            variantIndex = rnd.nextLong(numberOfVariants);
            StudentTaskVariantEntity studentTaskVariantEntity =
                    new StudentTaskVariantEntity(user.get().getId(), taskId, variantIndex);
            studentTaskVariantRepository.save(studentTaskVariantEntity);
        }

        String text = taskVariantRepository.getTextByVariantIndex(taskId, variantIndex);
        return new TaskVariantDto(variantIndex, text);
    }
    @CrossOrigin
    @DeleteMapping("/delete-task")
    public String deleteTask(@RequestParam Long id,
                             @CookieValue(value = "jwt") String token,
                             @CookieValue(value = "login") String login,
                             @CookieValue(value = "role") String role,
                             HttpServletResponse response) {
        if (!jwtTokenUtil.validateToken(token, login, role) || !role.equals("TEACHER")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        taskRepository.deleteById(id);
        return "ok";
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
    public List<SubmissionFileResponseDto> getSubmissionFiles(@CookieValue("jwt") String token,
                                                         @CookieValue("login") String login,
                                                         @CookieValue("role") String role,
                                                         @RequestParam Long taskId,
                                                         HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        if(role.equals("TEACHER")) {
            return submissionFileRepository.getTaskSubmissionFilesWithoutFileContent(taskId);
        }

        Long id = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        return submissionFileRepository.getUserTaskSubmissionFilesWithoutFileContent(id, taskId);
    }
    @CrossOrigin
    @GetMapping("/get-submission-file-content")
    public Optional<FileContentDto> getFileContent(@CookieValue("jwt") String token,
                                                   @CookieValue("login") String login,
                                                   @CookieValue("role") String role,
                                                   @RequestParam Long submissionFileId,
                                                   HttpServletResponse response) {
        if (!jwtTokenUtil.validateToken(token, login, role)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return Optional.empty();
        }

        Long id = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        if (!role.equals("TEACHER")) {
            Optional<Long> studentId = submissionFileRepository.getStudentByFileId(submissionFileId);

            if(studentId.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return Optional.empty();
            }

            if(!studentId.get().equals(id)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return Optional.empty();
            }
        }

        return submissionFileRepository.getFileContent(submissionFileId);
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
    @PostMapping("/add-submission-file")
    public Long addSubmissionFile(@CookieValue("jwt") String token,
                                  @CookieValue("login") String login,
                                  @CookieValue("role") String role,
                                  @RequestBody SubmissionFileRequestDto submissionFileRequestDto,
                                  HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("STUDENT")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        SubmissionEntity submission = submissionRepository.findById(submissionFileRequestDto.getSubmissionId()).get();
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

        return submissionFileRepository.save(new SubmissionFileEntity(submissionFileRequestDto,
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
                submissionRequestDto.getVariantIndex(),
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
