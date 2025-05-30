package com.iyad.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectUser {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    private Project project;

    @ManyToOne
    private MyUser user;

    public ProjectUser(Project project, MyUser user) {
        this.project = project;
        this.user = user;
    }
}
