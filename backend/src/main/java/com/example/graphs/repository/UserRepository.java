package com.example.graphs.repository;

import com.example.graphs.repository.entity.UserEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByLogin(String login);

    @Modifying
    @Transactional
    @Query(value = "update users set role = :role where id = :id", nativeQuery = true)
    void updateRole(@Param("id") Long id, @Param("role") String role);
}

