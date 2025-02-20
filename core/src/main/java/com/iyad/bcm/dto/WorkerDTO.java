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
    private double totalMoneyAmountRequested;
    private double totalMoneyAmountPaid;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public LocalDate getStartedOn() {
        return startedOn;
    }

    public void setStartedOn(LocalDate startedOn) {
        this.startedOn = startedOn;
    }

    public LocalDate getEndedOn() {
        return endedOn;
    }

    public void setEndedOn(LocalDate endedOn) {
        this.endedOn = endedOn;
    }

    public double getTotalMoneyAmountRequested() {
        return totalMoneyAmountRequested;
    }

    public void setTotalMoneyAmountRequested(double totalMoneyAmountRequested) {
        this.totalMoneyAmountRequested = totalMoneyAmountRequested;
    }

    public double getTotalMoneyAmountPaid() {
        return totalMoneyAmountPaid;
    }

    public void setTotalMoneyAmountPaid(double totalMoneyAmountPaid) {
        this.totalMoneyAmountPaid = totalMoneyAmountPaid;
    }
}
