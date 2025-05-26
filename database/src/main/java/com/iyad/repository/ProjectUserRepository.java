package com.iyad.repository;

import com.iyad.model.Project;
import com.iyad.model.ProjectUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectUserRepository extends JpaRepository<ProjectUser, UUID> {
    boolean existsByProject_IdAndUser_Id(UUID projectId, UUID userId);

    List<ProjectUser> findAllByUser_Id(UUID userId);

    Optional<ProjectUser> findByProject_Id(UUID projectId);
}
