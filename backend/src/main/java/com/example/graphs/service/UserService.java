package com.example.graphs.service;

import com.example.graphs.repository.UserRepository;
import com.example.graphs.repository.entity.UserEntity;
import com.example.graphs.service.model.MyUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public void addUser(MyUser user) {
        userRepository.save(new UserEntity(user.getLogin(), passwordEncoder.encode(user.getPassword()), user.getRole()));
    }

    public MyUser getUserByUsername(String login)
            throws UsernameNotFoundException {
        Optional<UserEntity> user = userRepository.findByLogin(login);

        if(user.isPresent())
            return new MyUser(user.get());
        else throw new UsernameNotFoundException(login + " not found");
    }
}
