package com.example.graphs.controller;

import com.example.graphs.controller.dto.FileContentDto;
import com.example.graphs.controller.dto.LectureDto;
import com.example.graphs.jwt.JwtTokenUtil;
import com.example.graphs.repository.LectureRepository;
import com.example.graphs.repository.entity.LectureEntity;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    @GetMapping("/all-lectures-without-content")
    public List<LectureDto> getLectures() {
        return lectureRepository.getLecturesWithoutContent();
    }
    @CrossOrigin
    @GetMapping("/get-file-content")
    public Optional<FileContentDto> getFileContent(@RequestParam Long id) {
        return lectureRepository.getLectureContent(id);
    }

    @CrossOrigin
    @DeleteMapping("/delete-lecture")
    public String deleteLecture(@RequestParam Long id,
                                @CookieValue(value = "jwt") String token,
                                @CookieValue(value = "login") String login,
                                @CookieValue(value = "role") String role,
                                HttpServletResponse response) {
        if (!jwtTokenUtil.validateToken(token, login, role) || !role.equals("TEACHER")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        lectureRepository.deleteById(id);
        return "ok";
    }
}
