package com.example.graphs.repository.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "lecture_text_fields")
public class LectureTextFieldEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long lectureId;
    private Long fieldIndex; // indices of fields indicate their order in the lecture, they may be non-consecutive
                                // but should be in right relative order

    @Column(columnDefinition = "TEXT")
    private String content;
}
