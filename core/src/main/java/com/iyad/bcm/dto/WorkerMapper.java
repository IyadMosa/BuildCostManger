package com.iyad.bcm.dto;

import com.iyad.model.Worker;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WorkerMapper {
    WorkerDTO toDTO(Worker worker);

    Worker toEntity(WorkerDTO workerDTO);
}