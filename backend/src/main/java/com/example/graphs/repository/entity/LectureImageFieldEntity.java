package com.example.graphs.repository.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "lecture_image_fields")
public class LectureImageFieldEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long lectureId;
    private Long fieldIndex; // indices of fields indicate their order in the lecture, they may be non-consecutive
    // but should be in right relative order
    private String mimeType;
    private byte[] content;
}
