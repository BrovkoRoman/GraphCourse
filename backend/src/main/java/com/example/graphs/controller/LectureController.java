package com.example.graphs.controller;

import com.example.graphs.jwt.JwtTokenUtil;
import com.example.graphs.repository.LectureRepository;
import com.example.graphs.repository.entity.LectureEntity;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class LectureController {
    @Autowired
    private LectureRepository lectureRepository;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
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
    @GetMapping("/all-lectures")
    public List<LectureEntity> getLectures() {
        return lectureRepository.findAll();
    }
}
