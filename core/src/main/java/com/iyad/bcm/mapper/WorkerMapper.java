package com.iyad.bcm.mapper;

import com.iyad.bcm.dto.WorkerDTO;
import com.iyad.enums.WorkerSpecialty;
import com.iyad.enums.WorkerType;
import com.iyad.model.Worker;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface WorkerMapper {
    @Mapping(target = "name", source = "name")
    @Mapping(target = "startedOn", source = "startedOn")
    @Mapping(target = "endedOn", source = "endedOn")
    @Mapping(target = "specialty", source = "specialty", qualifiedByName = "specialtyToString")
    WorkerDTO toDTO(Worker worker);

    @Mapping(target = "name", source = "name")
    @Mapping(target = "startedOn", source = "startedOn")
    @Mapping(target = "endedOn", source = "endedOn")
    @Mapping(target = "specialty", source = "specialty", qualifiedByName = "stringToSpecialty")
    @Mapping(target = "type", source = "specialty", qualifiedByName = "specialtyToType")
    @Mapping(target = "id", ignore = true)
    Worker toEntity(WorkerDTO workerDTO);

    @Named("specialtyToString")
    default String specialtyToString(WorkerSpecialty specialty) {
        return specialty != null ? specialty.getName("en") : null;
    }

    @Named("specialtyToType")
    default WorkerType specialtyToType(String specialty) {
        return specialty != null ? WorkerType.PROFESSIONAL : WorkerType.GENERAL;
    }

    @Named("stringToSpecialty")
    default WorkerSpecialty stringToSpecialty(String specialty) {
        return specialty != null ? WorkerSpecialty.valueOfLabel(specialty) : null;
    }
}