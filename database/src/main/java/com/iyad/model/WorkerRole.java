package com.iyad.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
public class WorkerRole {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String roleName;
    private String description;
}
