package com.example.graphs.controller.dto;

import lombok.Getter;

@Getter
public class UserResponseDto {
    private String jwt;
    private String role;

    public UserResponseDto(String jwt, String role) {
        this.jwt = jwt;
        this.role = role;
    }
}
