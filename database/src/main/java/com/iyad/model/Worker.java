package com.iyad.model;

import com.iyad.enums.WorkerSpecialty;
import com.iyad.enums.WorkerType;
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
    @ManyToOne
    private Project project;
    @ManyToOne
    private MyUser user;
    @Column(nullable = false, unique = true, updatable = false)
    private String name;
    @Enumerated(EnumType.STRING)
    private WorkerType type; // PROFESSIONAL, GENERAL
    @Enumerated(EnumType.STRING)
    private WorkerSpecialty specialty;
    private String phoneNumber;
    private LocalDate startedOn;
    private LocalDate endedOn;
    private double totalMoneyAmountRequested;
    private double totalMoneyAmountPaid;
    @OneToMany(mappedBy = "worker")
    private List<Payment> payments;
}