package com.iyad.bcm.dto;

import com.iyad.bcm.mapper.PaymentMapper;
import com.iyad.enums.PaymentMethod;
import com.iyad.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class PaymentMapperTest {

    private PaymentMapper paymentMapper;

    @BeforeEach
    void setUp() {
        paymentMapper = Mappers.getMapper(PaymentMapper.class);
    }

    @Test
    void testToCashPayment() {
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(100.0);
        paymentDTO.setPaidAt(LocalDate.now());
        paymentDTO.setPaymentMethod(PaymentMethod.CASH);
        paymentDTO.setCurrency("USD");

        CashPayment cashPayment = paymentMapper.toCashPayment(paymentDTO);

        assertNotNull(cashPayment);
        assertEquals(paymentDTO.getAmount(), cashPayment.getAmount());
        assertEquals(paymentDTO.getPaidAt(), cashPayment.getPaidAt());
        assertEquals(paymentDTO.getPaymentMethod(), cashPayment.getPaymentMethod());
        assertEquals(paymentDTO.getCurrency(), cashPayment.getCurrency());
    }

    @Test
    void testToCheckPayment() {
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(200.0);
        paymentDTO.setPaidAt(LocalDate.now());
        paymentDTO.setPaymentMethod(PaymentMethod.CHECK);
        paymentDTO.setCheckNumber("123456");
        paymentDTO.setCheckDate(LocalDate.now());
        paymentDTO.setPayeeName("John Doe");
        paymentDTO.setBankName("Bank of America");

        CheckPayment checkPayment = paymentMapper.toCheckPayment(paymentDTO);

        assertNotNull(checkPayment);
        assertEquals(paymentDTO.getAmount(), checkPayment.getAmount());
        assertEquals(paymentDTO.getPaidAt(), checkPayment.getPaidAt());
        assertEquals(paymentDTO.getPaymentMethod(), checkPayment.getPaymentMethod());
        assertEquals(paymentDTO.getCheckNumber(), checkPayment.getCheckNumber());
        assertEquals(paymentDTO.getCheckDate(), checkPayment.getCheckDate());
        assertEquals(paymentDTO.getPayeeName(), checkPayment.getPayeeName());
        assertEquals(paymentDTO.getBankName(), checkPayment.getBankName());
    }

    @Test
    void testToCreditCardPayment() {
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(300.0);
        paymentDTO.setPaidAt(LocalDate.now());
        paymentDTO.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        paymentDTO.setTransactionId("txn123");
        paymentDTO.setCardHolderName("Jane Doe");
        paymentDTO.setTransactionDate(LocalDate.now());

        CreditCardPayment creditCardPayment = paymentMapper.toCreditCardPayment(paymentDTO);

        assertNotNull(creditCardPayment);
        assertEquals(paymentDTO.getAmount(), creditCardPayment.getAmount());
        assertEquals(paymentDTO.getPaidAt(), creditCardPayment.getPaidAt());
        assertEquals(paymentDTO.getPaymentMethod(), creditCardPayment.getPaymentMethod());
        assertEquals(paymentDTO.getTransactionId(), creditCardPayment.getTransactionId());
        assertEquals(paymentDTO.getCardHolderName(), creditCardPayment.getCardHolderName());
        assertEquals(paymentDTO.getTransactionDate(), creditCardPayment.getTransactionDate());
    }

    @Test
    void testToBankTransferPayment() {
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(400.0);
        paymentDTO.setPaidAt(LocalDate.now());
        paymentDTO.setPaymentMethod(PaymentMethod.BANK_TRANSFER);
        paymentDTO.setTransactionId("txn456");
        paymentDTO.setBankAccount("123456789");
        paymentDTO.setBankBranch("Main Branch");
        paymentDTO.setBankName("Chase");

        BankTransferPayment bankTransferPayment = paymentMapper.toBankTransferPayment(paymentDTO);

        assertNotNull(bankTransferPayment);
        assertEquals(paymentDTO.getAmount(), bankTransferPayment.getAmount());
        assertEquals(paymentDTO.getPaidAt(), bankTransferPayment.getPaidAt());
        assertEquals(paymentDTO.getPaymentMethod(), bankTransferPayment.getPaymentMethod());
        assertEquals(paymentDTO.getTransactionId(), bankTransferPayment.getTransactionId());
        assertEquals(paymentDTO.getBankAccount(), bankTransferPayment.getBankAccount());
        assertEquals(paymentDTO.getBankBranch(), bankTransferPayment.getBankBranch());
        assertEquals(paymentDTO.getBankName(), bankTransferPayment.getBankName());
    }

    @Test
    void testToPaymentDTO() {
        Payment payment = new CashPayment();
        payment.setId(UUID.randomUUID());
        payment.setAmount(500.0);
        payment.setPaidAt(LocalDate.now());
        payment.setPaymentMethod(PaymentMethod.CASH);

        PaymentDTO paymentDTO = paymentMapper.toPaymentDTO(payment);

        assertNotNull(paymentDTO);
        assertEquals(payment.getId(), paymentDTO.getId());
        assertEquals(payment.getAmount(), paymentDTO.getAmount());
        assertEquals(payment.getPaidAt(), paymentDTO.getPaidAt());
        assertEquals(payment.getPaymentMethod(), paymentDTO.getPaymentMethod());
    }
}