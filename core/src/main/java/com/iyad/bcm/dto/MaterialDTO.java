package com.iyad.bcm.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class MaterialDTO {
    private UUID id;
    private String name;
    private String description;
    private double price;
    private String unit;
    private double quantity;
    private double totalCost;
    private LocalDate date;


}
