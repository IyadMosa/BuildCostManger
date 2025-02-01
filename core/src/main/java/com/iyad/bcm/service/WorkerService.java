package com.iyad.bcm.service;

import com.iyad.bcm.dto.WorkerDTO;
import com.iyad.bcm.dto.WorkerMapper;
import com.iyad.model.Worker;
import com.iyad.repository.WorkerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        Worker worker = workerMapper.toEntity(dto);
        workerRepository.save(worker);
    }

    public WorkerDTO getWorkerById(UUID id) {
        Worker worker = workerRepository.findById(id).orElse(null);
        return workerMapper.toDTO(worker);
    }
}
