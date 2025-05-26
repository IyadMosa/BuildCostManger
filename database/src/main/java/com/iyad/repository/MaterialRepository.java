package com.iyad.repository;

import com.iyad.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MaterialRepository extends JpaRepository<Material, UUID> {
    List<Material> findByShop_NameAndProject_IdAndUser_Id(String name, UUID projectId, UUID userId);

}

