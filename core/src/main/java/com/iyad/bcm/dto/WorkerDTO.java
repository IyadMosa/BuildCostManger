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
    private String role;
    private LocalDate startedOn;
    private LocalDate endedOn;
}
