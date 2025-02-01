package com.iyad.repository;

import com.iyad.model.MaterialTransportation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MaterialTransportationRepository extends JpaRepository<MaterialTransportation, UUID> {
}

