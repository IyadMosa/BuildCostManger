package com.iyad.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@DiscriminatorValue("CHECK")
public class CheckPayment extends Payment {

    private String checkNumber;
    private String bankName;
    private LocalDate checkDate;
    private String payeeName;
}
