package com.example.graphs.repository;

import com.example.graphs.repository.entity.LectureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LectureRepository extends JpaRepository <LectureEntity, Long> {
}
