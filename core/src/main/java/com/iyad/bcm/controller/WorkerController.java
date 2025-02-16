package com.iyad.bcm.controller;

import com.iyad.bcm.dto.WorkerDTO;
import com.iyad.bcm.service.WorkerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {
    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @Operation(summary = "Create a new worker", description = "Adds a new worker to the system", tags = {"Worker"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Worker created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid token", content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden - Expired token", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping
    public ResponseEntity<Void> createWorker(@RequestBody WorkerDTO workerDTO) {
        workerService.addWorker(workerDTO);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get all workers", description = "Retrieves a list of all workers", tags = {"Worker"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of workers retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid token", content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden - Expired token", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping
    public ResponseEntity<List<WorkerDTO>> getAllWorker() {
        List<WorkerDTO> dtos = workerService.getAllWorkers();
        return ResponseEntity.ok(dtos);
    }

    @Operation(summary = "Get worker by ID", description = "Retrieves a worker by their ID", tags = {"Worker"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Worker retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid token", content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden - Expired token", content = @Content),
            @ApiResponse(responseCode = "404", description = "Worker not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<WorkerDTO> getWorker(@PathVariable UUID id) {
        WorkerDTO dto = workerService.getWorkerById(id);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Get worker specialties", description = "Retrieves a list of all worker specialties", tags = {"Worker"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of specialties retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid token", content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden - Expired token", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping("/specialties")
    public ResponseEntity<Set<String>> getWorkerSpecialties() {
        Set<String> specialties = workerService.getWorkerSpecialities();
        return ResponseEntity.ok(specialties);
    }

}