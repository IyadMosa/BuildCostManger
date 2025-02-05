package com.iyad.bcm.service;

import com.iyad.bcm.dto.ShopDTO;
import com.iyad.bcm.mapper.ShopMapper;
import com.iyad.exception.ResourceNotFoundException;
import com.iyad.model.Shop;
import com.iyad.model.Worker;
import com.iyad.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ShopService {

    private final ShopRepository shopRepository;
    private final ShopMapper shopMapper;

    public ShopService(ShopRepository shopRepository, ShopMapper shopMapper) {
        this.shopRepository = shopRepository;
        this.shopMapper = shopMapper;
    }

    @Transactional
    public void createOrUpdateShop(ShopDTO dto) {
        Optional byName = shopRepository.findByName(dto.getName());
        Shop shop = shopMapper.toEntity(dto);
        if (byName.isPresent()) {
            shop.setId(((Worker) byName.get()).getId());
        }
        shopRepository.save(shop);
    }


    @Transactional(readOnly = true)
    public Set<?> getAllShops(boolean nameOnly) {
        return nameOnly ? shopRepository.findShopNames() : shopRepository.findAll().stream().map(shopMapper::toDTO).collect(Collectors.toSet());
    }
    @Transactional
    public void deleteShop(String name) {
        if (shopRepository.deleteByName(name) == 0) throw new ResourceNotFoundException("Shop not found");
    }

    @Transactional(readOnly = true)
    public Shop getShopByName(String name) throws Throwable {
        return (Shop) shopRepository.findByName(name).orElseThrow(() -> new ResourceNotFoundException("Shop not found"));
    }
}