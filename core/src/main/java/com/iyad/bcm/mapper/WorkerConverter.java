package com.iyad.bcm.mapper;

import com.iyad.enums.WorkerSpecialty;
import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

@Component
public class WorkerConverter extends AbstractConverter<String, WorkerSpecialty> {

    @Override
    protected WorkerSpecialty convert(String source) {
        return WorkerSpecialty.valueOf(source.toUpperCase().replace(" ", "_"));
    }

}