package com.iyad.bcm.controller;

import com.iyad.bcm.dto.PaymentDTO;
import com.iyad.bcm.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {


    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<String> createPayment(@RequestBody PaymentDTO paymentDTO) throws Throwable {
        if (paymentDTO.getWorkerName() == null || paymentDTO.getWorkerName().isEmpty()) {
            return ResponseEntity.badRequest().body("Worker name should not be empty");
        }
        paymentService.save(paymentDTO);
        return ResponseEntity.ok("Payment created successfully");
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentDTO> getPayment(@PathVariable UUID paymentId) {
        PaymentDTO paymentDTO = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(paymentDTO);
    }
}
