package com.example.graphs.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FileContentDto {
    private String mimeType;
    private byte[] fileContent;
}
