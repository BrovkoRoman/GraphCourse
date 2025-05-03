package com.example.graphs.controller.dto;
import lombok.Getter;

@Getter
public class SubmissionFileRequestDto {
    private Long submissionId;
    private Long taskId;
    private String fileName;
    private String mimeType;
    private byte[] fileContent;
}
