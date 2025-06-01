package com.iyad.bcm.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iyad.bcm.dto.ProjectDTO;
import com.iyad.model.MyUser;
import com.iyad.model.Project;
import com.iyad.model.ProjectUser;
import com.iyad.repository.ProjectRepository;
import com.iyad.repository.ProjectUserRepository;
import com.iyad.security.ProjectContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectAccessService {
    private final ProjectUserRepository projectUserRepository;
    private final ProjectRepository projectRepository;
    private final ObjectMapper objectMapper;

    public ProjectUser validateAccessAndGet() {
        UUID projectId = ProjectContext.get();
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof String) {
            throw new AccessDeniedException("Access denied: No user is authenticated.");
        }
        MyUser userDetails = (MyUser) principal;
        UUID userId = userDetails.getId();
        if (!projectUserRepository.existsByProject_IdAndUser_Id(projectId, userId)) {
            throw new AccessDeniedException("Access denied to project: " + projectId);
        }
        ProjectUser projectUser = projectUserRepository.findByProject_Id(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        return projectUser;
    }


    public List<ProjectDTO> getAllProjects(UUID userId) {
        return projectUserRepository.findAllByUser_Id(userId).stream()
                .map(projectUser -> objectMapper.convertValue(projectUser.getProject(), ProjectDTO.class))
                .toList();
    }

    public ProjectDTO createProject(String name) {
        Optional optional = projectRepository.findByName(name);
        if (optional.isPresent()) {
            throw new IllegalArgumentException("Project with name " + name + " already exists.");
        }
        Project project = projectRepository.save(new Project(name));
        MyUser userDetails = (MyUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        projectUserRepository.save(new ProjectUser(project, userDetails));
        return objectMapper.convertValue(project, ProjectDTO.class);

    }
}