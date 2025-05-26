package com.iyad.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @ManyToOne
    private Project project;
    @ManyToOne
    private MyUser user;
    @Column(nullable = false, unique = true, updatable = false)
    private String name;

    private String shopOwner;

    private String phoneNumber;

    private String location;
    private double totalMoneyAmountRequested;
    private double totalMoneyAmountPaid;

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments;

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Material> materials = new ArrayList<>();
}
