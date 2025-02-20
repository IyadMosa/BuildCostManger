package com.iyad.bcm.config;

import com.iyad.bcm.mapper.WorkerConverter;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper(WorkerConverter workerConverter) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addConverter(workerConverter);
        return modelMapper;

    }
}
