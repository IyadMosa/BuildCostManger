package com.iyad.bcm.controller;

import com.iyad.bcm.dto.WorkerDTO;
import com.iyad.bcm.service.WorkerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {
    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @PostMapping
    public ResponseEntity createWorker(@RequestBody WorkerDTO workerDTO) {
        workerService.addWorker(workerDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerDTO> getWorker(@PathVariable UUID id) {
        WorkerDTO dto = workerService.getWorkerById(id);
        return ResponseEntity.ok(dto);
    }

}
