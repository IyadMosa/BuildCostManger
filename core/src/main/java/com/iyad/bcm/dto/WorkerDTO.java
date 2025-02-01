package com.iyad.bcm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkerDTO {
    private UUID id;
    private String name;
    private String specialty;
    private LocalDate startedOn;
    private LocalDate endedOn;


    public UUID getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getSpecialty() {
        return this.specialty;
    }

    public LocalDate getStartedOn() {
        return this.startedOn;
    }

    public LocalDate getEndedOn() {
        return this.endedOn;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public void setStartedOn(LocalDate startedOn) {
        this.startedOn = startedOn;
    }

    public void setEndedOn(LocalDate endedOn) {
        this.endedOn = endedOn;
    }
}
