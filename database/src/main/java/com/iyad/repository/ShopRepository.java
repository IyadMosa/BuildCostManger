package com.iyad.repository;

import com.iyad.model.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ShopRepository extends JpaRepository<Shop, UUID> {

    Optional<Shop> findByNameAndProject_IdAndUser_Id(String name, UUID projectId, UUID userId);

    int deleteByNameAndProject_IdAndUser_Id(String name, UUID projectId, UUID userId);

    @Query("SELECT DISTINCT s.name FROM Shop s WHERE s.project.id = :projectId AND s.user.id = :userId")
    Set<String> findShopNamesByProject_IdAndUser_Id(UUID projectId, UUID userId);

    Set<Shop> findAllByProject_IdAndUser_Id(UUID projectId, UUID userId);
}
