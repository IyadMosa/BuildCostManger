package com.iyad.bcm.mapper;

import com.iyad.bcm.dto.MaterialDTO;
import com.iyad.model.Material;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface MaterialMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "totalCost", source = "totalCost")
    MaterialDTO toDTO(Material material);

    @Mapping(target = "id", ignore = true)
    Material toEntity(MaterialDTO materialDTO);
}