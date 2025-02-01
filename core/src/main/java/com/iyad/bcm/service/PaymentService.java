package com.iyad.bcm.service;

import com.iyad.bcm.dto.PaymentDTO;
import com.iyad.bcm.dto.PaymentMapper;
import com.iyad.model.Payment;
import com.iyad.model.Worker;
import com.iyad.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentMapper paymentMapper;
    private final PaymentRepository paymentRepository;

    private final WorkerService workerService;

    public PaymentService(PaymentMapper paymentMapper, PaymentRepository paymentRepository, WorkerService workerService) {
        this.paymentMapper = paymentMapper;
        this.paymentRepository = paymentRepository;
        this.workerService = workerService;
    }

    public Payment processPayment(PaymentDTO paymentDTO) {
        switch (paymentDTO.getPaymentMethod()) {
            case CASH:
                return paymentMapper.toCashPayment(paymentDTO);
            case CHECK:
                return paymentMapper.toCheckPayment(paymentDTO);
            case CREDIT_CARD:
                return paymentMapper.toCreditCardPayment(paymentDTO);
            case BANK_TRANSFER:
                return paymentMapper.toBankTransferPayment(paymentDTO);
            default:
                throw new IllegalArgumentException("Invalid payment method");
        }
    }

    public PaymentDTO getPaymentById(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        return paymentMapper.toPaymentDTO(payment);
    }

    public void save(PaymentDTO paymentDTO) throws Throwable {
        Worker worker = workerService.getWorkerByName(paymentDTO.getWorkerName());
        Payment payment = processPayment(paymentDTO);
        payment.setWorker(worker);
        paymentRepository.save(payment);
    }
}
