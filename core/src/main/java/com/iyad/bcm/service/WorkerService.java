package com.iyad.bcm.service;

import com.iyad.bcm.dto.WorkerDTO;
import com.iyad.enums.WorkerSpecialty;
import com.iyad.model.ProjectUser;
import com.iyad.model.Worker;
import com.iyad.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final ModelMapper modelMapper;
    private final ProjectAccessService projectAccessService;

    @Transactional
    public void addWorker(WorkerDTO dto) {
        ProjectUser projectUser = projectAccessService.validateAccessAndGet();
        UUID projectId = projectUser.getProject().getId();
        UUID userId = projectUser.getUser().getId();
        Optional byName = workerRepository.findByNameAndProject_IdAndUser_Id(dto.getName(), projectId, userId);
        Worker worker = modelMapper.map(dto, Worker.class);
        if (byName.isPresent()) {
            worker.setId(((Worker) byName.get()).getId());
        }
        worker.setProject(projectUser.getProject());
        worker.setUser(projectUser.getUser());
        workerRepository.save(worker);
    }

    public Worker getWorkerByName(String workerName) throws Throwable {
        ProjectUser projectUser = projectAccessService.validateAccessAndGet();
        UUID projectId = projectUser.getProject().getId();
        UUID userId = projectUser.getUser().getId();
        Worker worker = workerRepository.findByNameAndProject_IdAndUser_Id(workerName, projectId, userId).orElseThrow(() -> new Exception("Worker not found with name: " + workerName));
        return worker;

    }

    public List<WorkerDTO> getAllWorkers() {
        ProjectUser projectUser = projectAccessService.validateAccessAndGet();
        UUID projectId = projectUser.getProject().getId();
        UUID userId = projectUser.getUser().getId();
        return workerRepository.findAllByProject_IdAndUser_id(projectId, userId).stream().map(worker -> modelMapper.map(worker, WorkerDTO.class)).toList();
    }

    public Set<String> getWorkerSpecialities() {
        return Arrays.stream(WorkerSpecialty.values()).map(specialty -> specialty.getName("en")).collect(Collectors.toSet());
    }

    public void saveWorker(Worker worker) {
        workerRepository.save(worker);
    }
}
