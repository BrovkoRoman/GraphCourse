package com.example.graphs.controller;

import com.example.graphs.controller.dto.StudentScoreDto;
import com.example.graphs.controller.dto.StudentTestScoresDto;
import com.example.graphs.controller.dto.TaskScoreDto;
import com.example.graphs.jwt.JwtTokenUtil;
import com.example.graphs.repository.*;
import com.example.graphs.service.model.StudentTaskScore;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
public class ScoreController {
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private SubmissionRepository submissionRepository;
    @Autowired
    private StudentTestScoreRepository studentTestScoreRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TestRepository testRepository;
    @Autowired
    private UserRepository userRepository;
    @CrossOrigin
    @GetMapping("/student-score")
    public double getStudentTotalScore(@CookieValue("jwt") String token,
                                       @CookieValue("login") String login,
                                       @CookieValue("role") String role,
                                       HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("STUDENT")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return 0;
        }

        Long id = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        List<TaskScoreDto> taskScores = submissionRepository.getTaskScores(id);
        List<StudentTestScoresDto> testScores = studentTestScoreRepository.getStudentScores(id);

        double sum = 0;

        for (TaskScoreDto taskScoreDto: taskScores) {
            sum += taskScoreDto.getScore();
        }
        for(StudentTestScoresDto testScoreDto: testScores) {
            sum += testScoreDto.getScore();
        }

        return sum;
    }
    @CrossOrigin
    @GetMapping("/total-max-score")
    public double getTotalMaxScore() {
        return taskRepository.getTotalScore() + testRepository.getTotalScore();
    }
    @GetMapping("/student-score-list")
    public List<StudentScoreDto> getStudentScoreList(@CookieValue("jwt") String token,
                                                     @CookieValue("login") String login,
                                                     @CookieValue("role") String role,
                                                     HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("TEACHER")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        List<StudentTaskScore> taskScores = submissionRepository.getTaskScoresOfAllStudents();
        List<StudentScoreDto> testScores = studentTestScoreRepository.getTotalScoresOfAllStudents();

        Map<String, Double> scoresMap = new HashMap<>();

        for(StudentTaskScore el: taskScores) {
            double currentScore = scoresMap.getOrDefault(el.getLogin(), 0.0);
            scoresMap.put(el.getLogin(), currentScore + el.getScore());
        }
        for(StudentScoreDto el: testScores) {
            double currentScore = scoresMap.getOrDefault(el.getLogin(), 0.0);
            scoresMap.put(el.getLogin(), currentScore + el.getScore());
        }

        List<StudentScoreDto> ans = new ArrayList<>();

        for(Map.Entry<String, Double> el: scoresMap.entrySet()) {
            ans.add(new StudentScoreDto(el.getKey(),
                                        el.getValue()));
        }

        return ans;
    }
}
