package com.iyad.bcm.mapper;

import com.iyad.bcm.dto.ShopDTO;
import com.iyad.model.Shop;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShopMapper {
    @Mapping(target = "name", source = "name")
    @Mapping(target = "shopOwner", source = "shopOwner")
    @Mapping(target = "location", source = "location")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    ShopDTO toDTO(Shop shop);

    @Mapping(target = "name", source = "name")
    @Mapping(target = "shopOwner", source = "shopOwner")
    @Mapping(target = "location", source = "location")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    @Mapping(target = "id", ignore = true)
    Shop toEntity(ShopDTO shopDTO);
}
