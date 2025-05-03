package com.example.graphs.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LectureDto {
    private Long id;
    private Long sectionId;
    private String fileName;
}