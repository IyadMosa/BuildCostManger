package com.iyad.repository;

import com.iyad.model.WorkerRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WorkerRoleRepository extends JpaRepository<WorkerRole, UUID> {
}