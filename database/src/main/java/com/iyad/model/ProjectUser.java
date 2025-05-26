package com.iyad.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;
@Entity
@Data
public class ProjectUser {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    private Project project;

    @ManyToOne
    private MyUser user;
}
