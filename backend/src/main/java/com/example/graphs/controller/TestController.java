package com.example.graphs.controller;

import com.example.graphs.controller.dto.*;
import com.example.graphs.jwt.JwtTokenUtil;
import com.example.graphs.repository.*;
import com.example.graphs.repository.entity.*;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@AllArgsConstructor
public class TestController {
    @Autowired
    private TestRepository testRepository;
    @Autowired
    private TestQuestionRepository testQuestionRepository;
    @Autowired
    private PossibleAnswerToQuestionRepository possibleAnswerToQuestionRepository;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private StudentTestAnswerRepository studentTestAnswerRepository;
    @Autowired
    private StudentTestScoreRepository studentTestScoreRepository;
    @CrossOrigin
    @GetMapping("/all-published-tests")
    public List<TestEntity> getPublishedTests() {
        return testRepository.findAllByPublishedTrue();
    }
    @CrossOrigin
    @GetMapping("/all-tests")
    public List<TestEntity> getTests(@CookieValue(value = "jwt") String token,
                                     @CookieValue(value = "login") String login,
                                     @CookieValue(value = "role") String role,
                                     HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("TEACHER")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        return testRepository.findAll();
    }
    @CrossOrigin
    @PutMapping("/publish-test")
    public String publishTest(@RequestParam Long testId,
                              @CookieValue(value = "jwt") String token,
                              @CookieValue(value = "login") String login,
                              @CookieValue(value = "role") String role,
                              HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("TEACHER")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        testRepository.publishTest(testId);
        return "Test is published";
    }
    @CrossOrigin
    @GetMapping("/get-questions")
    public List<TestQuestionEntity> getQuestions(@RequestParam Long testId) {
    return testQuestionRepository.findAllByTestId(testId);
    }
    @CrossOrigin
    @GetMapping("/get-possible-answers") // sends to client all possible answers without 'correct' attribute
    public List<PossibleAnswerDto> getPossibleAnswers(@RequestParam Long testId) {
        return possibleAnswerToQuestionRepository.getAllWithoutCorrectnessByTestId(testId);
    }
    @CrossOrigin
    @PostMapping("/new-test")
    public Long addTest(@RequestBody TestEntity test, @CookieValue(value = "jwt") String token,
                        @CookieValue(value = "login") String login,
                        @CookieValue(value = "role") String role, HttpServletResponse response) {
        if (jwtTokenUtil.validateToken(token, login, role) && role.equals("TEACHER")) {
            return testRepository.save(test).getId();
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }
    @CrossOrigin
    @PostMapping("/new-question")
    public String addQuestion(@RequestBody QuestionRequestDto questionRequestDto,
                                           @CookieValue(value = "jwt") String token,
                                           @CookieValue(value = "login") String login,
                                           @CookieValue(value = "role") String role, HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("TEACHER")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        Long questionId = testQuestionRepository.save(questionRequestDto.getQuestionEntity()).getId();

        for(PossibleAnswerToQuestionEntity answer : questionRequestDto.getPossibleAnswers()) {
            answer.setQuestionId(questionId);
            possibleAnswerToQuestionRepository.save(answer);
        }

        return "ok";
    }

    public boolean checkSubmissionValidity(TestSubmissionDto testSubmissionDto,
                                           List<TestQuestionEntity> questions, // all questions and possible answers
                                           List<PossibleAnswerToQuestionEntity> possibleAnswers) { // by test id from DB
        if(!testRepository.existsByIdAndPublishedTrue(testSubmissionDto.getTestId())) {
            return false;
        }

        Map<Long, Integer> countAnswersForQuestion = new HashMap<>();

        for(StudentTestAnswerEntity studentTestAnswerEntity : testSubmissionDto.getAnswers()) {
            Long questionId = studentTestAnswerEntity.getQuestionId();

            boolean validQuestionId = false;
            int questionType = -1;

            for(TestQuestionEntity question : questions) {
                if (question.getId().equals(questionId)) {
                    validQuestionId = true;
                    questionType = question.getType();
                    break;
                }
            }

            if(!validQuestionId) {
                return false;
            }

            int newCount = countAnswersForQuestion.getOrDefault(questionId, 0) + 1;

            if((questionType == 1 || questionType == 2) && newCount >= 2) { // many answers
                                                                            // for non-multiple-answer question
                return false;
            }

            countAnswersForQuestion.put(questionId, newCount);

            if(questionType == 1) { // text answer
                continue;
            }

            boolean validPossibleAnswerId = false;

            for(PossibleAnswerToQuestionEntity answer : possibleAnswers) {
                if(answer.getId().toString().equals(studentTestAnswerEntity.getAnswer())) {
                    validPossibleAnswerId = true;
                    break;
                }
            }

            if(!validPossibleAnswerId) {
                return false;
            }
        }

        return true;
    }

    public double calculateSubmissionScore(TestSubmissionDto testSubmissionDto,
                                           List<TestQuestionEntity> questions,
                                           List<PossibleAnswerToQuestionEntity> possibleAnswers) throws Exception {
        double score = 0;
        int maxScore = testRepository.getMaxScore(testSubmissionDto.getTestId()).get();
        double questionScore = (double)maxScore / questions.size();

        Map<Long, Integer> correctAnswersChosenToQuestionCount = new HashMap<>(); // for multiple-answer
        Map<Long, Integer> incorrectAnswersChosenToQuestionCount = new HashMap<>(); // questions

        for(StudentTestAnswerEntity answer : testSubmissionDto.getAnswers()) {
            for(PossibleAnswerToQuestionEntity possibleAnswer : possibleAnswers) {
                if(possibleAnswer.getQuestionId().equals(answer.getQuestionId())) {
                    int questionType = -1;

                    for(TestQuestionEntity question : questions) {
                        if(question.getId().equals(possibleAnswer.getQuestionId())) {
                            questionType = question.getType();
                            break;
                        }
                    }

                    boolean answersAreSame = false;

                    if(questionType == -1) {
                        throw new Exception();
                    } else if(questionType == 1) {
                        answersAreSame = possibleAnswer.getText().equals(answer.getAnswer());
                    } else if(questionType == 2 || questionType == 3) {
                        answersAreSame = possibleAnswer.getId().toString().equals(answer.getAnswer());
                    }

                    if(!answersAreSame) {
                        continue;
                    }

                    if(possibleAnswer.isCorrect()) {
                        if(questionType == 3) {
                            correctAnswersChosenToQuestionCount.put(answer.getQuestionId(),
                                    correctAnswersChosenToQuestionCount.getOrDefault(answer.getQuestionId(),
                                            0) + 1);
                        } else {
                            score++;
                        }
                    }
                    else if(questionType == 3) {
                        incorrectAnswersChosenToQuestionCount.put(answer.getQuestionId(),
                                incorrectAnswersChosenToQuestionCount.getOrDefault(answer.getQuestionId(),
                                        0) + 1);
                    }
                }
            }
        }

        Map<Long, Integer> correctAnswersToQuestion = new HashMap<>();
        Map<Long, Integer> incorrectAnswersToQuestion = new HashMap<>();

        for(PossibleAnswerToQuestionEntity possibleAnswer : possibleAnswers) {
            if(possibleAnswer.isCorrect()) {
                correctAnswersToQuestion.put(possibleAnswer.getQuestionId(),
                        correctAnswersToQuestion.getOrDefault(possibleAnswer.getQuestionId(),
                                0) + 1);
            } else {
                incorrectAnswersToQuestion.put(possibleAnswer.getQuestionId(),
                        incorrectAnswersToQuestion.getOrDefault(possibleAnswer.getQuestionId(),
                                0) + 1);
            }
        }

        // score for a multiple-answer question is
        // (true_positive + true_negative) / all_possible_answers * questionScore

        for(TestQuestionEntity question : questions) {
            Long questionId = question.getId();

            int truePositive = correctAnswersChosenToQuestionCount.getOrDefault(questionId, 0);
            int trueNegative = incorrectAnswersToQuestion.getOrDefault(questionId, 0) -
                    incorrectAnswersChosenToQuestionCount.getOrDefault(questionId, 0);
            int all = correctAnswersToQuestion.getOrDefault(questionId, 0)
                    + incorrectAnswersToQuestion.getOrDefault(questionId, 0);

            score += (double)(truePositive + trueNegative) / all;
        }

        return score * questionScore;
    }

    @CrossOrigin
    @PostMapping("/submit-test")
    public String submitTest(@RequestBody TestSubmissionDto testSubmissionDto,
                                              @CookieValue(value = "jwt") String token,
                                              @CookieValue(value = "login") String login,
                                              @CookieValue(value = "role") String role, HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("STUDENT")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        Long studentId = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        if(studentTestScoreRepository.existsByStudentIdAndTestId(studentId, testSubmissionDto.getTestId())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // second try is prohibited
            return null;
        }

        List<TestQuestionEntity> questions = testQuestionRepository.findAllByTestId(testSubmissionDto.getTestId());
        List<PossibleAnswerToQuestionEntity> possibleAnswers =
                possibleAnswerToQuestionRepository.getAllByTestId(testSubmissionDto.getTestId());

        if(!checkSubmissionValidity(testSubmissionDto, questions, possibleAnswers)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return null;
        }

        double score;

        try {
            score = calculateSubmissionScore(testSubmissionDto, questions, possibleAnswers);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return null;
        }

        studentTestScoreRepository.save(new StudentTestScoreEntity(studentId, testSubmissionDto.getTestId(), score));

        for(StudentTestAnswerEntity answer : testSubmissionDto.getAnswers()) {
            answer.setStudentId(studentId);
            studentTestAnswerRepository.save(answer);
        }

        return "ok";
    }

    @CrossOrigin
    @GetMapping("/view-correct-answers")
    public List<PossibleAnswerDto> viewCorrectAnswers(@RequestParam Long testId,
                             @CookieValue(value = "jwt") String token,
                             @CookieValue(value = "login") String login,
                             @CookieValue(value = "role") String role, HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("STUDENT")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        Long studentId = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        if(!studentTestScoreRepository.existsByStudentIdAndTestId(studentId, testId)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // correct answers are available only after submission
            return null;
        }

        return possibleAnswerToQuestionRepository.getAllCorrectByTestId(testId);
    }

    @CrossOrigin
    @GetMapping("/get-student-answers")
    public StudentTestResponseDto getStudentAnswers(@RequestParam Long testId,
                                                    @CookieValue(value = "jwt") String token,
                                                    @CookieValue(value = "login") String login,
                                                    @CookieValue(value = "role") String role,
                                                    HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("STUDENT")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        Long studentId = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        Optional<Double> score = studentTestScoreRepository.getScoreByStudentIdAndTestId(studentId, testId);

        if(score.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }

        List<StudentTestAnswerResponseDto> answers =
                studentTestAnswerRepository.getAllByStudentIdAndTestId(studentId, testId);

        return new StudentTestResponseDto(score.get(), answers);
    }
    @GetMapping("/get-test-scores")
    public List<StudentTestScoresDto> getTestScores(@CookieValue(value = "jwt") String token,
                                                @CookieValue(value = "login") String login,
                                                @CookieValue(value = "role") String role,
                                                HttpServletResponse response) {
        if(!jwtTokenUtil.validateToken(token, login, role) || !role.equals("STUDENT")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        Long studentId = jwtTokenUtil.getClaimFromToken(token,
                (claims) -> Long.valueOf(claims.get("id").toString()));

        return studentTestScoreRepository.getStudentScores(studentId);
    }
}
