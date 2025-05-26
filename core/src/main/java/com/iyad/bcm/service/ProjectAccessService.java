package com.iyad.bcm.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iyad.bcm.dto.ProjectDTO;
import com.iyad.model.MyUser;
import com.iyad.model.Project;
import com.iyad.model.ProjectUser;
import com.iyad.repository.ProjectUserRepository;
import com.iyad.security.ProjectContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectAccessService {
    private final ProjectUserRepository projectUserRepository;
    private final ObjectMapper objectMapper;

    public void validateAccess(UUID projectId, UUID userId) {
        if (!projectUserRepository.existsByProject_IdAndUser_Id(projectId, userId)) {
            throw new AccessDeniedException("Access denied to project: " + projectId);
        }
    }

    public ProjectUser validateAccessAndGet() {
        UUID projectId = ProjectContext.get();
        MyUser userDetails = (MyUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
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

    public Project getProjectById(UUID projectId) {
        ProjectUser projectUser = projectUserRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));
        return projectUser.getProject();
    }
}