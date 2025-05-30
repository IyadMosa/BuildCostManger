package com.iyad.bcm.controller;

import com.iyad.bcm.dto.GeneralApiResponse;
import com.iyad.bcm.dto.ProjectDTO;
import com.iyad.bcm.service.ProjectAccessService;
import com.iyad.model.MyUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectAccessService service;

    @Operation(summary = "Get all projects", description = "Retrieves a list of all projects", tags = {"projects"})
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "List of projects retrieved successfully"), @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid token", content = @Content), @ApiResponse(responseCode = "403", description = "Forbidden - Expired token", content = @Content), @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)})
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        UUID userId = ((MyUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        List<ProjectDTO> dtos = service.getAllProjects(userId);
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<GeneralApiResponse> createProject(@RequestBody ProjectDTO projectDTO) {
        try {
            String name = projectDTO.getName();
            if (name == null || name.isEmpty()) {
                return ResponseEntity.badRequest().body(new GeneralApiResponse(false, "Project name is required"));
            }

            ProjectDTO dto = service.createProject(name);
            if (dto == null) {
                throw new RuntimeException("Failed to create project");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new GeneralApiResponse(false, e.getMessage()));
        }
        return ResponseEntity.ok(new GeneralApiResponse(true, "project created successfully"));
    }


}