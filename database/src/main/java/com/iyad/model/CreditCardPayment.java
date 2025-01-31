package com.iyad.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

@Data
@Entity
@DiscriminatorValue("CREDIT_CARD")
public class CreditCardPayment extends Payment {

    private String transactionId;
    private String cardHolderName;
}
