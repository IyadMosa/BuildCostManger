package com.iyad.bcm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GeneralApiResponse {
    private boolean success;
    private String message;

}
