package com.example.graphs.controller;

import com.example.graphs.controller.dto.FileContentDto;
import com.example.graphs.jwt.JwtTokenUtil;
import com.example.graphs.repository.LectureImageFieldRepository;
import com.example.graphs.repository.LectureRepository;
import com.example.graphs.repository.LectureTextFieldRepository;
import com.example.graphs.repository.entity.LectureEntity;
import com.example.graphs.repository.entity.LectureImageFieldEntity;
import com.example.graphs.repository.entity.LectureTextFieldEntity;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class LectureController {
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private LectureRepository lectureRepository;
    @Autowired
    private LectureTextFieldRepository lectureTextFieldRepository;
    @Autowired
    private LectureImageFieldRepository lectureImageFieldRepository;
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
    @PostMapping("/new-lecture-text-field")
    public Long addLectureTextField(@RequestBody LectureTextFieldEntity field,
                                    @CookieValue(value = "jwt") String token,
                                    @CookieValue(value = "login") String login,
                                    @CookieValue(value = "role") String role,
                                    HttpServletResponse response) {
        if(jwtTokenUtil.validateToken(token, login, role) && role.equals("TEACHER")) {
            lectureTextFieldRepository.shiftFieldsForInsertion(field.getLectureId(), field.getFieldIndex());
            lectureImageFieldRepository.shiftFieldsForInsertion(field.getLectureId(), field.getFieldIndex());
            return lectureTextFieldRepository.save(field).getId();
        }
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }
    @CrossOrigin
    @PostMapping("/new-lecture-image-field")
    public Long addLectureImageField(@RequestBody LectureImageFieldEntity field,
                                     @CookieValue(value = "jwt") String token,
                                     @CookieValue(value = "login") String login,
                                     @CookieValue(value = "role") String role,
                                     HttpServletResponse response) {
        if(jwtTokenUtil.validateToken(token, login, role) && role.equals("TEACHER")) {
            lectureTextFieldRepository.shiftFieldsForInsertion(field.getLectureId(), field.getFieldIndex());
            lectureImageFieldRepository.shiftFieldsForInsertion(field.getLectureId(), field.getFieldIndex());
            return lectureImageFieldRepository.save(field).getId();
        }
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }
    @CrossOrigin
    @GetMapping("/all-lectures")
    public List<LectureEntity> getLectures() {
        return lectureRepository.getLecturesWithoutContent();
    }
    @CrossOrigin
    @GetMapping("/get-lecture-text-fields")
    public List<LectureTextFieldEntity> getLectureTextFields(@RequestParam Long id) {
        return lectureTextFieldRepository.getTextFieldsOfLecture(id);
    }
    @CrossOrigin
    @GetMapping("/get-lecture-image-fields")
    public List<LectureImageFieldEntity> getLectureImageFields(@RequestParam Long id) {
        return lectureImageFieldRepository.getImageFieldsOfLecture(id);
    }
    @CrossOrigin
    @PutMapping("/update-lecture-text-field")
    public String updateLectureTextField(@RequestParam Long id, @RequestBody String content,
                                         @CookieValue(value = "jwt") String token,
                                         @CookieValue(value = "login") String login,
                                         @CookieValue(value = "role") String role,
                                         HttpServletResponse response) {
        if(jwtTokenUtil.validateToken(token, login, role) && role.equals("TEACHER")) {
            lectureTextFieldRepository.updateField(id, content);
            return "ok";
        }
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
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
    @CrossOrigin
    @DeleteMapping("/delete-lecture-text-field")
    public String deleteLectureTextField(@RequestParam Long id,
                                         @CookieValue(value = "jwt") String token,
                                         @CookieValue(value = "login") String login,
                                         @CookieValue(value = "role") String role,
                                         HttpServletResponse response) {
        if (!jwtTokenUtil.validateToken(token, login, role) || !role.equals("TEACHER")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        lectureTextFieldRepository.deleteById(id);
        return "ok";
    }
    @CrossOrigin
    @DeleteMapping("/delete-lecture-image-field")
    public String deleteLectureImageField(@RequestParam Long id,
                                         @CookieValue(value = "jwt") String token,
                                         @CookieValue(value = "login") String login,
                                         @CookieValue(value = "role") String role,
                                         HttpServletResponse response) {
        if (!jwtTokenUtil.validateToken(token, login, role) || !role.equals("TEACHER")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        lectureImageFieldRepository.deleteById(id);
        return "ok";
    }
}
