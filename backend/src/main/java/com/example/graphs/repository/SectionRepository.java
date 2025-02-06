package com.example.graphs.repository;

import com.example.graphs.repository.entity.LectureEntity;
import com.example.graphs.repository.entity.SectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository extends JpaRepository<SectionEntity, Long> {
}