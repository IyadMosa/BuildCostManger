package com.iyad.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

@Data
@Entity
@DiscriminatorValue("CASH")
public class CashPayment extends Payment {
    private String currency;

}