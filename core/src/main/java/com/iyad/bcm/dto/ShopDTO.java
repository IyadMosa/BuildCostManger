package com.iyad.bcm.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ShopDTO {
    private UUID id;
    private String name;
    private String shopOwner;
    private String location;
    private String phoneNumber;
    private double totalMoneyAmountRequested;
    private double totalMoneyAmountPaid;
}