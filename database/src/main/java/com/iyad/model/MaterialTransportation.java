package com.iyad.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Data
public class MaterialTransportation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String transportCompany;

    private double cost;

    @OneToMany(mappedBy = "transportation")
    private List<Payment> payments;
}