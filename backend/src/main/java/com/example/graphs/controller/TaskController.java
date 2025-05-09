package com.example.graphs.controller;

import com.example.graphs.controller.dto.*;
import com.example.graphs.jwt.JwtTokenUtil;
import com.example.graphs.repository.SubmissionFileRepository;
import com.example.graphs.repository.SubmissionRepository;
import com.example.graphs.repository.TaskRepository;
import com.example.graphs.repository.entity.SubmissionEntity;
import com.example.graphs.repository.entity.SubmissionFileEntity;
import com.example.graphs.repository.entity.TaskEntity;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@AllArgsConstructor
public class TaskController {
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private TaskRepository taskRepository;
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
