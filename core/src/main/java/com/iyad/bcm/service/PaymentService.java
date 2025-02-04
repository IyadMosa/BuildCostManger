package com.iyad.bcm.service;

import com.iyad.bcm.dto.PaymentDTO;
import com.iyad.bcm.mapper.PaymentMapper;
import com.iyad.model.Payment;
import com.iyad.model.Shop;
import com.iyad.model.Worker;
import com.iyad.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentMapper paymentMapper;
    private final PaymentRepository paymentRepository;
    private final ShopService shopService;
    private final WorkerService workerService;

    private Payment processPayment(PaymentDTO paymentDTO) {
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

    @Transactional(readOnly = true)
    public PaymentDTO getPaymentById(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        return paymentMapper.toPaymentDTO(payment);
    }

    //Shop
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByShopName(String shopName) {
        List<Payment> payments = paymentRepository.findByShop_Name(shopName);
        return payments.stream().map(paymentMapper::toPaymentDTO).toList();
    }


    @Transactional
    public void payForShop(String name, PaymentDTO dto) throws Throwable {
        Payment payment = processPayment(dto);
        Shop shop = shopService.getShopByName(name);
        payment.setShop(shop);
        paymentRepository.save(payment);

    }

    //Worker
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByWorkerName(String workerName) {
        List<Payment> payments = paymentRepository.findByWorker_Name(workerName);
        return payments.stream().map(paymentMapper::toPaymentDTO).toList();
    }

    @Transactional
    public void payForWorker(String name, PaymentDTO dto) throws Throwable {
        Payment payment = processPayment(dto);
        Worker worker = workerService.getWorkerByName(name);
        payment.setWorker(worker);
        paymentRepository.save(payment);
    }
}
