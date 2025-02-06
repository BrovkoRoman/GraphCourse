package com.example.graphs.controller.dto;

import lombok.Getter;

@Getter
public class UserDto {
    private String login;
    private String password;

    public UserDto(String login, String password) {
        this.login = login;
        this.password = password;
    }
}
