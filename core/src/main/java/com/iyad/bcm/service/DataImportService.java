package com.iyad.bcm.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iyad.model.*;
import com.iyad.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Service responsible for importing data from JSON format back to the database
 * This service can restore data from backup files created by DataExportService
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DataImportService {

    private final ProjectRepository projectRepository;
    private final MaterialRepository materialRepository;
    private final WorkerRepository workerRepository;
    private final PaymentRepository paymentRepository;
    private final ShopRepository shopRepository;
    private final ProjectUserRepository projectUserRepository;
    private final UserRepository userRepository;

    private final ObjectMapper objectMapper;

    /**
     * Imports all data from a JSON file to the database
     * @param filePath the path of the JSON file to import
     * @param clearExistingData whether to clear existing data before import
     * @return true if import was successful, false otherwise
     */
    @Transactional
    public boolean importAllData(String filePath, boolean clearExistingData) {
        log.info("Starting data import from file: {}", filePath);

        try {
            // Check if file exists
            File file = new File(filePath);
            if (!file.exists()) {
                log.error("Import file does not exist: {}", filePath);
                return false;
            }

            // Read JSON data
            log.debug("Reading JSON data from file...");
            Map<String, Object> importData = objectMapper.readValue(file, new TypeReference<Map<String, Object>>() {});

            // Validate file structure
            if (!validateImportData(importData)) {
                log.error("Invalid import file structure");
                return false;
            }

            // Clear existing data if requested
            if (clearExistingData) {
                log.info("Clearing existing data before import...");
                clearAllData();
            }

            // Import data in the correct order (dependencies first)
            importUsers(importData);
            importProjects(importData);
            importShops(importData);
            importProjectUsers(importData);
            importMaterials(importData);
            importWorkers(importData);
            importPayments(importData);

            log.info("Data import completed successfully");
            return true;

        } catch (IOException e) {
            log.error("IO Error during data import: {}", e.getMessage(), e);
            return false;
        } catch (Exception e) {
            log.error("Unexpected error during data import: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Validates the structure of import data
     */
    private boolean validateImportData(Map<String, Object> importData) {
        log.debug("Validating import data structure...");

        try {
            // Check for required sections
            String[] requiredSections = {"users", "projects", "materials", "workers", "payments", "shops", "projectUsers", "metadata"};

            for (String section : requiredSections) {
                if (!importData.containsKey(section)) {
                    log.warn("Missing required section in import data: {}", section);
                }
            }

            // Check metadata
            if (importData.containsKey("metadata")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> metadata = (Map<String, Object>) importData.get("metadata");
                log.info("Import file metadata - Version: {}, Export timestamp: {}, Total records: {}",
                        metadata.get("version"), metadata.get("exportTimestamp"), metadata.get("totalRecords"));
            }

            return true;
        } catch (Exception e) {
            log.error("Error validating import data: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Clears all existing data from the database
     */
    private void clearAllData() {
        log.debug("Clearing all existing data...");

        try {
            // Delete in reverse dependency order
            paymentRepository.deleteAll();
            log.debug("Cleared payments");

            materialRepository.deleteAll();
            log.debug("Cleared materials");

            workerRepository.deleteAll();
            log.debug("Cleared workers");

            projectUserRepository.deleteAll();
            log.debug("Cleared project users");

            shopRepository.deleteAll();
            log.debug("Cleared shops");

            projectRepository.deleteAll();
            log.debug("Cleared projects");

            userRepository.deleteAll();
            log.debug("Cleared users");

            log.info("All existing data cleared successfully");
        } catch (Exception e) {
            log.error("Error clearing existing data: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void importUsers(Map<String, Object> importData) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> usersData = (List<Map<String, Object>>) importData.get("users");

            if (usersData != null) {
                List<MyUser> users = objectMapper.convertValue(usersData, new TypeReference<List<MyUser>>() {});
                userRepository.saveAll(users);
                log.debug("Imported {} users", users.size());
            }
        } catch (Exception e) {
            log.error("Error importing users: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void importProjects(Map<String, Object> importData) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> projectsData = (List<Map<String, Object>>) importData.get("projects");

            if (projectsData != null) {
                List<Project> projects = objectMapper.convertValue(projectsData, new TypeReference<List<Project>>() {});
                projectRepository.saveAll(projects);
                log.debug("Imported {} projects", projects.size());
            }
        } catch (Exception e) {
            log.error("Error importing projects: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void importShops(Map<String, Object> importData) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> shopsData = (List<Map<String, Object>>) importData.get("shops");

            if (shopsData != null) {
                List<Shop> shops = objectMapper.convertValue(shopsData, new TypeReference<List<Shop>>() {});
                shopRepository.saveAll(shops);
                log.debug("Imported {} shops", shops.size());
            }
        } catch (Exception e) {
            log.error("Error importing shops: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void importProjectUsers(Map<String, Object> importData) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> projectUsersData = (List<Map<String, Object>>) importData.get("projectUsers");

            if (projectUsersData != null) {
                List<ProjectUser> projectUsers = objectMapper.convertValue(projectUsersData, new TypeReference<List<ProjectUser>>() {});
                projectUserRepository.saveAll(projectUsers);
                log.debug("Imported {} project users", projectUsers.size());
            }
        } catch (Exception e) {
            log.error("Error importing project users: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void importMaterials(Map<String, Object> importData) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> materialsData = (List<Map<String, Object>>) importData.get("materials");

            if (materialsData != null) {
                List<Material> materials = objectMapper.convertValue(materialsData, new TypeReference<List<Material>>() {});
                materialRepository.saveAll(materials);
                log.debug("Imported {} materials", materials.size());
            }
        } catch (Exception e) {
            log.error("Error importing materials: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void importWorkers(Map<String, Object> importData) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> workersData = (List<Map<String, Object>>) importData.get("workers");

            if (workersData != null) {
                List<Worker> workers = objectMapper.convertValue(workersData, new TypeReference<List<Worker>>() {});
                workerRepository.saveAll(workers);
                log.debug("Imported {} workers", workers.size());
            }
        } catch (Exception e) {
            log.error("Error importing workers: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void importPayments(Map<String, Object> importData) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> paymentsData = (List<Map<String, Object>>) importData.get("payments");

            if (paymentsData != null) {
                List<Payment> payments = objectMapper.convertValue(paymentsData, new TypeReference<List<Payment>>() {});
                paymentRepository.saveAll(payments);
                log.debug("Imported {} payments", payments.size());
            }
        } catch (Exception e) {
            log.error("Error importing payments: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Gets import preview statistics without performing the actual import
     * @param filePath the path of the JSON file to analyze
     * @return a map containing statistics about the data to be imported
     */
    public Map<String, Object> getImportPreview(String filePath) {
        log.debug("Analyzing import file: {}", filePath);

        try {
            File file = new File(filePath);
            if (!file.exists()) {
                log.error("Import file does not exist: {}", filePath);
                return Map.of("error", "File not found");
            }

            Map<String, Object> importData = objectMapper.readValue(file, new TypeReference<Map<String, Object>>() {});

            Map<String, Object> preview = new java.util.HashMap<>();

            // Count records in each section
            countRecordsInSection(importData, "users", preview);
            countRecordsInSection(importData, "projects", preview);
            countRecordsInSection(importData, "materials", preview);
            countRecordsInSection(importData, "workers", preview);
            countRecordsInSection(importData, "payments", preview);
            countRecordsInSection(importData, "shops", preview);
            countRecordsInSection(importData, "projectUsers", preview);

            // Add metadata if available
            if (importData.containsKey("metadata")) {
                preview.put("metadata", importData.get("metadata"));
            }

            return preview;

        } catch (Exception e) {
            log.error("Error analyzing import file: {}", e.getMessage(), e);
            return Map.of("error", e.getMessage());
        }
    }

    private void countRecordsInSection(Map<String, Object> importData, String section, Map<String, Object> preview) {
        @SuppressWarnings("unchecked")
        List<?> sectionData = (List<?>) importData.get(section);
        int count = sectionData != null ? sectionData.size() : 0;
        preview.put(section + "Count", count);
    }
}
