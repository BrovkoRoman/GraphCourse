package com.example.graphs.service.model;

import com.example.graphs.repository.entity.UserEntity;
import lombok.Getter;

@Getter
public class MyUser {
    private Long id;
    private String login;
    private String password;
    private String role;

    public MyUser(String login, String password, String role) {
        this.login = login;
        this.password = password;
        this.role = role;
    }

    public MyUser(UserEntity userEntity) {
        this.id = userEntity.getId();
        this.login = userEntity.getLogin();
        this.password = userEntity.getPassword();
        this.role = userEntity.getRole();
    }
}
