package com.iyad.repository;

import com.iyad.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByShop_NameAndProject_IdAndUser_Id(String name, UUID projectId, UUID userId);

    List<Payment> findByWorker_NameAndProject_IdAndUser_Id(String name, UUID projectId, UUID userId);

    List<Payment> findAllByProject_IdAndUser_Id(UUID projectId, UUID userId);
}