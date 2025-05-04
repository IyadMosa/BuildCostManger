package com.iyad.bcm.service;

import com.iyad.bcm.dto.PaymentDTO;
import com.iyad.model.*;
import com.iyad.repository.PaymentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ShopService shopService;
    private final WorkerService workerService;
    private final ModelMapper modelMapper;

    public PaymentService(PaymentRepository paymentRepository, ShopService shopService, WorkerService workerService, ModelMapper modelMapper) {
        this.paymentRepository = paymentRepository;
        this.shopService = shopService;
        this.workerService = workerService;
        this.modelMapper = modelMapper;
    }

    private Payment processPayment(PaymentDTO paymentDTO) {
        switch (paymentDTO.getPaymentMethod()) {
            case CASH:
                return modelMapper.map(paymentDTO, CashPayment.class);
            case CHECK:
                return modelMapper.map(paymentDTO, CheckPayment.class);
            case CREDIT_CARD:
                return modelMapper.map(paymentDTO, CreditCardPayment.class);
            case BANK_TRANSFER:
                return modelMapper.map(paymentDTO, BankTransferPayment.class);
            default:
                throw new IllegalArgumentException("Invalid payment method");
        }
    }

    @Transactional(readOnly = true)
    public PaymentDTO getPaymentById(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        return modelMapper.map(payment, PaymentDTO.class);
    }

    //Shop
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByShopName(String shopName) {
        List<Payment> payments = paymentRepository.findByShop_Name(shopName);
        return payments.stream().map(payment -> modelMapper.map(payment, PaymentDTO.class)).toList();
    }


    @Transactional
    public void payForShop(String name, PaymentDTO dto) throws Throwable {
        Payment payment = processPayment(dto);
        Shop shop = shopService.getShopByName(name);
        shop.setTotalMoneyAmountPaid(shop.getTotalMoneyAmountPaid() + dto.getAmount());
        payment.setShop(shop);
        paymentRepository.save(payment);

    }

    //Worker
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByWorkerName(String workerName) {
        List<Payment> payments = paymentRepository.findByWorker_Name(workerName);
        return payments.stream().map(payment -> modelMapper.map(payment, PaymentDTO.class)).toList();
    }

    @Transactional
    public void payForWorker(String name, PaymentDTO dto) throws Throwable {
        Payment payment = processPayment(dto);
        Worker worker = workerService.getWorkerByName(name);
        worker.setTotalMoneyAmountPaid(worker.getTotalMoneyAmountPaid() + dto.getAmount());
        payment.setWorker(worker);
        paymentRepository.save(payment);
    }
}
