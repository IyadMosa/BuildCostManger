package com.iyad.bcm.service;

import com.iyad.bcm.dto.ShopDTO;
import com.iyad.exception.ResourceNotFoundException;
import com.iyad.model.ProjectUser;
import com.iyad.model.Shop;
import com.iyad.model.Worker;
import com.iyad.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final ModelMapper modelMapper;
    private final ProjectAccessService projectAccessService;


    @Transactional
    public void createOrUpdateShop(ShopDTO dto) {
        ProjectUser projectUser = projectAccessService.validateAccessAndGet();
        UUID projectId = projectUser.getProject().getId();
        UUID userId = projectUser.getUser().getId();
        Optional byName = shopRepository.findByNameAndProject_IdAndUser_Id(dto.getName(), projectId, userId);
        Shop shop = modelMapper.map(dto, Shop.class);
        if (byName.isPresent()) {
            shop.setId(((Worker) byName.get()).getId());
        }
        shop.setProject(projectUser.getProject());
        shop.setUser(projectUser.getUser());
        shopRepository.save(shop);
    }


    @Transactional(readOnly = true)
    public Set<?> getAllShops(boolean nameOnly) {
        ProjectUser projectUser = projectAccessService.validateAccessAndGet();
        UUID projectId = projectUser.getProject().getId();
        UUID userId = projectUser.getUser().getId();
        return nameOnly ? shopRepository.findShopNamesByProject_IdAndUser_Id(projectId, userId) : shopRepository.findAllByProject_IdAndUser_Id(projectId, userId).stream().map(shop -> modelMapper.map(shop, ShopDTO.class)).collect(Collectors.toSet());
    }
    @Transactional
    public void deleteShop(String name) {
        ProjectUser projectUser = projectAccessService.validateAccessAndGet();
        UUID projectId = projectUser.getProject().getId();
        UUID userId = projectUser.getUser().getId();
        if (shopRepository.deleteByNameAndProject_IdAndUser_Id(name, projectId, userId) == 0)
            throw new ResourceNotFoundException("Shop not found");
    }

    @Transactional(readOnly = true)
    public Shop getShopByName(String name) {
        ProjectUser projectUser = projectAccessService.validateAccessAndGet();
        UUID projectId = projectUser.getProject().getId();
        UUID userId = projectUser.getUser().getId();
        return shopRepository.findByNameAndProject_IdAndUser_Id(name, projectId, userId).orElseThrow(() -> new ResourceNotFoundException("Shop not found"));
    }
}