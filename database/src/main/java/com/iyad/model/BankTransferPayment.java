package com.iyad.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@DiscriminatorValue("BANK_TRANSFER")
public class BankTransferPayment extends Payment {

    private String transactionId;
    private String bankAccount;
    private String bankName;
    private String bankBranch;
    private LocalDate transactionDate;
}
