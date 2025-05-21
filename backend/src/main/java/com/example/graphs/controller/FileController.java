package com.example.graphs.controller;

import com.example.graphs.controller.dto.FileContentDto;
import com.example.graphs.controller.dto.FileDto;
import com.example.graphs.jwt.JwtTokenUtil;
import com.example.graphs.repository.FileRepository;
import com.example.graphs.repository.entity.FileEntity;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
public class FileController {
    @Autowired
    private FileRepository fileRepository;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @CrossOrigin
    @PostMapping("/new-file")
    public Long addFile(@RequestBody FileEntity file, @CookieValue(value = "jwt") String token,
                           @CookieValue(value = "login") String login,
                           @CookieValue(value = "role") String role, HttpServletResponse response) {
        if(jwtTokenUtil.validateToken(token, login, role) && role.equals("TEACHER")) {
            return fileRepository.save(file).getId();
        }
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
    }

    @CrossOrigin
    @GetMapping("/all-files-without-content")
    public List<FileDto> getFiles() {
        return fileRepository.getFilesWithoutContent();
    }
    @CrossOrigin
    @GetMapping("/get-file-content")
    public Optional<FileContentDto> getFileContent(@RequestParam Long id) {
        return fileRepository.getFileContent(id);
    }

    @CrossOrigin
    @DeleteMapping("/delete-file")
    public String deleteFile(@RequestParam Long id,
                                @CookieValue(value = "jwt") String token,
                                @CookieValue(value = "login") String login,
                                @CookieValue(value = "role") String role,
                                HttpServletResponse response) {
        if (!jwtTokenUtil.validateToken(token, login, role) || !role.equals("TEACHER")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        fileRepository.deleteById(id);
        return "ok";
    }
}
