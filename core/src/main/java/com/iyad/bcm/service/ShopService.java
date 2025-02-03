package com.iyad.bcm.service;

import com.iyad.bcm.dto.ShopDTO;
import com.iyad.bcm.mapper.ShopMapper;
import com.iyad.model.Shop;
import com.iyad.model.Worker;
import com.iyad.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final ShopMapper mapper;

    @Transactional
    public void createOrUpdateShop(ShopDTO dto) {
        Optional byName = shopRepository.findByName(dto.getName());
        Shop shop = mapper.toEntity(dto);
        if (byName.isPresent()) {
            shop.setId(((Worker) byName.get()).getId());
        }
        shopRepository.save(shop);
    }


    @Transactional(readOnly = true)
    public List<ShopDTO> getAllShops() {
        return shopRepository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public void deleteShop(String name) throws Throwable {
        Shop shop = (Shop) shopRepository.findByName(name).orElseThrow(() -> new RuntimeException("Shop not found"));
        shopRepository.delete(shop);
    }

    public ShopDTO getShopByName(String name) throws Throwable {
        return mapper.toDTO((Shop) shopRepository.findByName(name).orElseThrow(() -> new RuntimeException("Shop not found")));
    }
}