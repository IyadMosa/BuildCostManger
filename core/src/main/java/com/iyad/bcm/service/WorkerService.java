package com.iyad.bcm.service;

import com.iyad.bcm.dto.WorkerDTO;
import com.iyad.bcm.mapper.WorkerMapper;
import com.iyad.model.Worker;
import com.iyad.repository.WorkerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final WorkerMapper workerMapper;

    public WorkerService(WorkerRepository workerRepository, WorkerMapper workerMapper) {
        this.workerRepository = workerRepository;
        this.workerMapper = workerMapper;
    }

    @Transactional
    public void addWorker(WorkerDTO dto) {
        Optional byName = workerRepository.findByName(dto.getName());
        Worker worker = workerMapper.toEntity(dto);
        if (byName.isPresent()) {
            worker.setId(((Worker) byName.get()).getId());
        }
        workerRepository.save(worker);
    }

    public WorkerDTO getWorkerById(UUID id) {
        Worker worker = workerRepository.findById(id).orElse(null);
        return workerMapper.toDTO(worker);
    }

    public Worker getWorkerByName(String workerName) throws Throwable {
        Worker worker = (Worker) workerRepository.findByName(workerName)
                .orElseThrow(() -> new Exception("Worker not found with name: " + workerName));
        return worker;

    }

    public List<WorkerDTO> getAllWorkers() {
        return workerRepository.findAll().stream()
                .map(workerMapper::toDTO)
                .toList();
    }
}
