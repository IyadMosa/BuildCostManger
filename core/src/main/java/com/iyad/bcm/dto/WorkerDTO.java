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
    private String phoneNumber;
    private LocalDate startedOn;
    private LocalDate endedOn;
    private double totalMoneyAmountRequested;
    private double totalMoneyAmountPaid;
}
