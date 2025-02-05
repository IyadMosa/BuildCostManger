package com.iyad.repository;

import com.iyad.model.MyUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<MyUser, Long> {

    MyUser getById(Long id);

    Optional<MyUser> findByUsername(String username);

    Optional<MyUser> findByEmail(String email);
}
