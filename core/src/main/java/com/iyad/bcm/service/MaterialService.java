package com.iyad.bcm.service;

import com.iyad.bcm.dto.MaterialDTO;
import com.iyad.model.Material;
import com.iyad.model.Shop;
import com.iyad.repository.MaterialRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.elasticsearch.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final ShopService shopService;
    private final ModelMapper modelMapper;

    public MaterialService(MaterialRepository materialRepository, ShopService shopService, ModelMapper modelMapper) {
        this.materialRepository = materialRepository;
        this.shopService = shopService;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public Material purchaseMaterial(String shopName, MaterialDTO materialDTO) throws Throwable {
        Material material = modelMapper.map(materialDTO, Material.class);
        Shop shop = getShop(shopName);
        shop.setTotalMoneyAmountRequested(shop.getTotalMoneyAmountRequested() + material.getTotalCost());
        material.setShop(shop);
        return materialRepository.save(material);
    }


    @Transactional(readOnly = true)
    public List<Material> getAllMaterialsByShop(String shopName) {
        return materialRepository.findByShop_Name(shopName);
    }

    @Transactional(readOnly = true)
    public MaterialDTO getMaterialById(UUID id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + id));
        MaterialDTO dto = modelMapper.map(material, MaterialDTO.class);
        return dto;
    }


    @Transactional
    public Material updateMaterial(String shopName, MaterialDTO updatedMaterial) throws Throwable {
        Material material = modelMapper.map(updatedMaterial, Material.class);
        Shop shop = getShop(shopName);
        material.setShop(shop);
        return materialRepository.save(material);
    }

    private Shop getShop(String shopName) throws Throwable {
        Shop shop = shopService.getShopByName(shopName);
        return shop;
    }

    @Transactional
    public void deleteMaterial(UUID id) {
        materialRepository.deleteById(id);
    }
}
