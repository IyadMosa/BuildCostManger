package com.iyad.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Data
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String name;
    private String role;
    private LocalDate startedOn;
    private LocalDate endedOn;
    @OneToMany(mappedBy = "worker")
    private List<Payment> payments;
}