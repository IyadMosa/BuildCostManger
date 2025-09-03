package com.iyad.bcm.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.iyad.model.*;
import com.iyad.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service responsible for exporting all database data to JSON format
 * and creating backups of the system data
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DataExportService {

    private final ProjectRepository projectRepository;
    private final MaterialRepository materialRepository;
    private final WorkerRepository workerRepository;
    private final PaymentRepository paymentRepository;
    private final ShopRepository shopRepository;
    private final ProjectUserRepository projectUserRepository;
    private final UserRepository userRepository;

    private final ObjectMapper objectMapper;

    /**
     * Exports all database data to a JSON file
     * @param filePath the path where the JSON file will be saved
     * @return true if export was successful, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean exportAllData(String filePath) {
        log.info("Starting data export to file: {}", filePath);

        try {
            Map<String, Object> exportData = new HashMap<>();

            // Export users first (as they are referenced by other entities)
            log.debug("Exporting users data...");
            List<MyUser> users = userRepository.findAll();
            exportData.put("users", users);
            log.debug("Exported {} users", users.size());

            // Export all entities
            log.debug("Exporting projects data...");
            List<Project> projects = projectRepository.findAll();
            exportData.put("projects", projects);
            log.debug("Exported {} projects", projects.size());

            log.debug("Exporting shops data...");
            List<Shop> shops = shopRepository.findAll();
            exportData.put("shops", shops);
            log.debug("Exported {} shops", shops.size());

            log.debug("Exporting project users data...");
            List<ProjectUser> projectUsers = projectUserRepository.findAll();
            exportData.put("projectUsers", projectUsers);
            log.debug("Exported {} project users", projectUsers.size());

            log.debug("Exporting materials data...");
            List<Material> materials = materialRepository.findAll();
            exportData.put("materials", materials);
            log.debug("Exported {} materials", materials.size());

            log.debug("Exporting workers data...");
            List<Worker> workers = workerRepository.findAll();
            exportData.put("workers", workers);
            log.debug("Exported {} workers", workers.size());

            log.debug("Exporting payments data...");
            List<Payment> payments = paymentRepository.findAll();
            exportData.put("payments", payments);
            log.debug("Exported {} payments", payments.size());

            // Add metadata
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("exportTimestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            metadata.put("version", "1.0");
            metadata.put("totalRecords", users.size() + projects.size() + materials.size() + workers.size() +
                                       payments.size() + shops.size() + projectUsers.size());
            exportData.put("metadata", metadata);

            // Write to file
            log.debug("Writing data to file: {}", filePath);
            objectMapper.writeValue(new File(filePath), exportData);

            log.info("Data export completed successfully. Total records exported: {}",
                    metadata.get("totalRecords"));
            return true;

        } catch (IOException e) {
            log.error("IO Error during data export: {}", e.getMessage(), e);
            return false;
        } catch (Exception e) {
            log.error("Unexpected error during data export: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Creates a backup file with timestamp in the filename
     * @param backupDirectory the directory where backup files will be stored
     * @return the path of the created backup file, or null if failed
     */
    public String createBackup(String backupDirectory) {
        log.info("Creating backup in directory: {}", backupDirectory);

        try {
            // Ensure backup directory exists
            File dir = new File(backupDirectory);
            if (!dir.exists()) {
                log.debug("Creating backup directory: {}", backupDirectory);
                if (!dir.mkdirs()) {
                    log.error("Failed to create backup directory: {}", backupDirectory);
                    return null;
                }
            }

            // Generate timestamped filename
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
            String backupFilePath = backupDirectory + File.separator + "backup_" + timestamp + ".json";

            // Export data to backup file
            boolean success = exportAllData(backupFilePath);

            if (success) {
                log.info("Backup created successfully: {}", backupFilePath);
                return backupFilePath;
            } else {
                log.error("Failed to create backup");
                return null;
            }

        } catch (Exception e) {
            log.error("Error creating backup: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Gets export statistics without performing the actual export
     * @return a map containing statistics about the data to be exported
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getExportStatistics() {
        log.debug("Calculating export statistics...");

        try {
            Map<String, Object> stats = new HashMap<>();

            stats.put("usersCount", userRepository.count());
            stats.put("projectsCount", projectRepository.count());
            stats.put("materialsCount", materialRepository.count());
            stats.put("workersCount", workerRepository.count());
            stats.put("paymentsCount", paymentRepository.count());
            stats.put("shopsCount", shopRepository.count());
            stats.put("projectUsersCount", projectUserRepository.count());

            long totalRecords = (Long) stats.values().stream()
                    .mapToLong(count -> (Long) count)
                    .sum();

            stats.put("totalRecords", totalRecords);
            stats.put("calculatedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            log.debug("Export statistics calculated: {} total records", totalRecords);
            return stats;

        } catch (Exception e) {
            log.error("Error calculating export statistics: {}", e.getMessage(), e);
            return new HashMap<>();
        }
    }
}
