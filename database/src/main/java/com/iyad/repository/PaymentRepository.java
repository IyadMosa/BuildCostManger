package com.iyad.repository;

import com.iyad.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByShop_Name(String name);

    List<Payment> findByWorker_Name(String name);
}