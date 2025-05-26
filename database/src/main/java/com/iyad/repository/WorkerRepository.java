package com.iyad.repository;

import com.iyad.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface WorkerRepository extends JpaRepository<Worker, UUID> {
    Optional<Worker> findByNameAndProject_IdAndUser_Id(String workerName, UUID projectId, UUID userId);

    List<Worker> findAllByProject_IdAndUser_id(UUID projectId, UUID userId);
}