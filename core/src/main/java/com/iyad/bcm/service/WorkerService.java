package com.iyad.bcm.service;

import com.iyad.bcm.dto.WorkerDTO;
import com.iyad.enums.WorkerSpecialty;
import com.iyad.model.Worker;
import com.iyad.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final ModelMapper modelMapper;

    public WorkerService(WorkerRepository workerRepository, ModelMapper modelMapper) {
        this.workerRepository = workerRepository;
        this.modelMapper = modelMapper;
    }
    @Transactional
    public void addWorker(WorkerDTO dto) {
        Optional byName = workerRepository.findByName(dto.getName());
        Worker worker = modelMapper.map(dto, Worker.class);
        if (byName.isPresent()) {
            worker.setId(((Worker) byName.get()).getId());
        }
        workerRepository.save(worker);
    }

    public WorkerDTO getWorkerById(UUID id) {
        Worker worker = workerRepository.findById(id).orElse(null);
        return modelMapper.map(worker, WorkerDTO.class);
    }

    public Worker getWorkerByName(String workerName) throws Throwable {
        Worker worker = (Worker) workerRepository.findByName(workerName)
                .orElseThrow(() -> new Exception("Worker not found with name: " + workerName));
        return worker;

    }

    public List<WorkerDTO> getAllWorkers() {
        return workerRepository.findAll().stream()
                .map(worker -> modelMapper.map(worker, WorkerDTO.class))
                .toList();
    }

    public Set<String> getWorkerSpecialities() {
        return Arrays.stream(WorkerSpecialty.values()).map(specialty -> specialty.getName("en")).collect(Collectors.toSet());
    }
}
