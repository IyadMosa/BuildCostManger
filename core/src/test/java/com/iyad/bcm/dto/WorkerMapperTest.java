package com.iyad.bcm.dto;

import com.iyad.enums.WorkerSpecialty;
import com.iyad.model.Worker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class WorkerMapperTest {

    @Autowired
    private WorkerMapper workerMapper;

    @Test
    void testWorkerMapping() {

        WorkerDTO workerDTO = new WorkerDTO(UUID.randomUUID(), "iyad", "Architect", LocalDate.of(2025, 2, 1), LocalDate.of(2026, 2, 1));

        Worker worker = workerMapper.toEntity(workerDTO);

        assertNotNull(worker);
        assertNull(worker.getId());
        assertEquals("iyad", worker.getName());
        assertEquals("Architect", worker.getSpecialty().getName("en"));
        assertEquals(LocalDate.of(2025, 2, 1), worker.getStartedOn());
    }

    @Test
    void testWorkerToWorkerDTOMapping() {
        Worker worker = new Worker();
        worker.setId(UUID.randomUUID());
        worker.setName("iyad");
        worker.setSpecialty(WorkerSpecialty.ARCHITECT);
        worker.setStartedOn(LocalDate.of(2025, 2, 1));
        worker.setEndedOn(LocalDate.of(2026, 2, 1));

        WorkerDTO workerDTO = workerMapper.toDTO(worker);

        assertNotNull(workerDTO);
        assertEquals(worker.getId(), workerDTO.getId());
        assertEquals("iyad", workerDTO.getName());
        assertEquals("Architect", workerDTO.getSpecialty());
        assertEquals(LocalDate.of(2025, 2, 1), workerDTO.getStartedOn());
        assertEquals(LocalDate.of(2026, 2, 1), workerDTO.getEndedOn());
    }

}