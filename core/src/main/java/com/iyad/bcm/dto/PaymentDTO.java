package com.iyad.bcm.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.iyad.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentDTO {
    private UUID id;
    private Double amount;
    private LocalDate paidAt;
    @JsonProperty("paymentMethod")
    private PaymentMethod paymentMethod;
    private String currency; // Cash-specific
    private String checkNumber; // Check-specific
    private LocalDate checkDate; // Check-specific
    private String payeeName; // Check-specific
    private String bankName; // Check-specific and Bank Transfer-specific
    private String transactionId; // Credit Card-specific and Bank Transfer-specific
    private String cardHolderName; // Credit Card-specific
    private LocalDate transactionDate; // Credit Card-specific
    private String bankAccount; // Bank Transfer-specific
    private String bankBranch; // Bank Transfer-specific
    private Double newRequestTotal; // For new requests (amount to add to requested)
    private Double newRequestPaid; // For new requests (amount to pay now, optional)

}