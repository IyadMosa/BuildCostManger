package com.iyad.repository;

import com.iyad.model.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ShopRepository extends JpaRepository<Shop, UUID> {

    Optional findByName(String name);

    int deleteByName(String name);

    Set<String> findShopNames();
}
