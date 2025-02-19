package com.example.graphs.controller;

import com.example.graphs.jwt.JwtTokenUtil;
import com.example.graphs.repository.*;
import com.example.graphs.repository.entity.*;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class SectionController {
    @Autowired
    private SectionRepository sectionRepository;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
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
    @GetMapping("/all-sections")
    public List<SectionEntity> getSections() {
        return sectionRepository.findAll();
    }
}
