package com.iyad.bcm.mapper;

import com.iyad.bcm.dto.PaymentDTO;
import com.iyad.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PaymentMapper {

    // Mapping from PaymentDTO to specific payment entity classes

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "amount", source = "amount")
    @Mapping(target = "paidAt", source = "paidAt")
    @Mapping(target = "paymentMethod", source = "paymentMethod")
    @Mapping(target = "currency", source = "currency") // Cash-specific
    CashPayment toCashPayment(PaymentDTO paymentDTO);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "amount", source = "amount")
    @Mapping(target = "paidAt", source = "paidAt")
    @Mapping(target = "paymentMethod", source = "paymentMethod")
    @Mapping(target = "checkNumber", source = "checkNumber") // Check-specific
    @Mapping(target = "checkDate", source = "checkDate") // Check-specific
    @Mapping(target = "payeeName", source = "payeeName") // Check-specific
    @Mapping(target = "bankName", source = "bankName") // Check-specific
    CheckPayment toCheckPayment(PaymentDTO paymentDTO);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "amount", source = "amount")
    @Mapping(target = "paidAt", source = "paidAt")
    @Mapping(target = "paymentMethod", source = "paymentMethod")
    @Mapping(target = "transactionId", source = "transactionId") // Credit Card-specific
    @Mapping(target = "cardHolderName", source = "cardHolderName") // Credit Card-specific
    @Mapping(target = "transactionDate", source = "transactionDate") // Credit Card-specific
    CreditCardPayment toCreditCardPayment(PaymentDTO paymentDTO);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "amount", source = "amount")
    @Mapping(target = "paidAt", source = "paidAt")
    @Mapping(target = "paymentMethod", source = "paymentMethod")
    @Mapping(target = "transactionId", source = "transactionId") // Bank Transfer-specific
    @Mapping(target = "bankAccount", source = "bankAccount") // Bank Transfer-specific
    @Mapping(target = "bankBranch", source = "bankBranch") // Bank Transfer-specific
    @Mapping(target = "bankName", source = "bankName") // Bank Transfer-specific
    BankTransferPayment toBankTransferPayment(PaymentDTO paymentDTO);

    // Mapping from Payment entity to PaymentDTO
    PaymentDTO toPaymentDTO(Payment payment);
}
