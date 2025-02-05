package com.iyad.service;

import com.iyad.dto.UserDTO;
import com.iyad.mapper.UserMapper;
import com.iyad.model.MyUser;
import com.iyad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        MyUser myuser = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return myuser;
    }

    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        MyUser myuser = userMapper.toEntity(userDTO);
        myuser.setJoinAt(LocalDate.now());
        MyUser savedMyUser = userRepository.save(myuser);
        return userMapper.toDTO(savedMyUser);
    }

    @Transactional(readOnly = true)
    public UserDTO getUserByName(String name) {
        MyUser myuser = userRepository.findByUsername(name).orElse(null);
        return userMapper.toDTO(myuser);
    }
}
