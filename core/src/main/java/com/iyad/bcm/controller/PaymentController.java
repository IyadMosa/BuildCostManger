package com.iyad.bcm.controller;

import com.iyad.bcm.dto.PaymentDTO;
import com.iyad.bcm.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {


    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentDTO> getPayment(@PathVariable UUID paymentId) {
        PaymentDTO paymentDTO = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(paymentDTO);
    }


    //Shop
    @PostMapping("/shop/{name}")
    public ResponseEntity<String> payForShop(@PathVariable String name, @RequestBody PaymentDTO dto) throws Throwable {
        paymentService.payForShop(name, dto);
        return ResponseEntity.ok("Payment for shop created successfully");
    }

    @GetMapping("/shop/{name}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByShopName(@PathVariable String name) {
        List<PaymentDTO> dtos = paymentService.getPaymentsByShopName(name);
        return ResponseEntity.ok(dtos);
    }

    //Worker
    @PostMapping("/worker/{name}")
    public ResponseEntity<String> payForWorker(@PathVariable String name, @RequestBody PaymentDTO dto) throws Throwable {
        paymentService.payForWorker(name, dto);
        return ResponseEntity.ok("Payment for worker created successfully");
    }

    @GetMapping("/worker/{name}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByWorkerName(@PathVariable String name) {
        List<PaymentDTO> dtos = paymentService.getPaymentsByWorkerName(name);
        return ResponseEntity.ok(dtos);
    }


}
