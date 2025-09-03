package com.iyad.bcm.controller;

import com.iyad.bcm.service.BackupSchedulerService;
import com.iyad.bcm.service.DataExportService;
import com.iyad.bcm.service.DataImportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for database export and import operations
 * Provides endpoints for backing up and restoring system data
 */
@RestController
@RequestMapping("/api/data")
@RequiredArgsConstructor
@Slf4j
public class DataExportImportController {

    private final DataExportService dataExportService;
    private final DataImportService dataImportService;
    private final BackupSchedulerService backupSchedulerService;

    @Value("${app.backup.directory:${user.home}/buildcostmanager/backups}")
    private String defaultBackupDirectory;

    @Value("${app.export.directory:${user.home}/buildcostmanager/exports}")
    private String defaultExportDirectory;

    /**
     * Export all database data to JSON format
     * GET /api/data/export
     */
    @GetMapping("/export")
    public ResponseEntity<Map<String, Object>> exportData(
            @RequestParam(required = false) String filename) {

        log.info("Received request to export data with filename: {}", filename);

        try {
            // Ensure export directory exists
            Path exportDir = Paths.get(defaultExportDirectory);
            if (!Files.exists(exportDir)) {
                Files.createDirectories(exportDir);
                log.debug("Created export directory: {}", defaultExportDirectory);
            }

            // Generate filename if not provided or empty
            if (filename == null || filename.trim().isEmpty()) {
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
                filename = "data_export_" + timestamp + ".json";
                log.debug("Generated default filename: {}", filename);
            } else {
                // Trim whitespace from provided filename
                filename = filename.trim();
                // Ensure .json extension (safe null check)
                if (!filename.toLowerCase().endsWith(".json")) {
                    filename += ".json";
                    log.debug("Added .json extension to filename: {}", filename);
                }
            }

            String filePath = defaultExportDirectory + File.separator + filename;

            // Perform export
            boolean success = dataExportService.exportAllData(filePath);

            Map<String, Object> response = new HashMap<>();

            if (success) {
                response.put("success", true);
                response.put("message", "Data exported successfully");
                response.put("filePath", filePath);
                response.put("filename", filename);
                response.put("exportedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

                // Add statistics
                response.put("statistics", dataExportService.getExportStatistics());

                log.info("Data export completed successfully: {}", filePath);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Failed to export data");
                log.error("Data export failed");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

        } catch (Exception e) {
            log.error("Error in export endpoint: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Export failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Download exported data file
     * GET /api/data/download/{filename}
     */
    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadExportFile(@PathVariable String filename) {
        log.info("Received request to download file: {}", filename);

        try {
            // Sanitize filename to prevent directory traversal
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                log.warn("Invalid filename requested: {}", filename);
                return ResponseEntity.badRequest().build();
            }

            Path filePath = Paths.get(defaultExportDirectory, filename);

            if (!Files.exists(filePath)) {
                log.warn("Requested file does not exist: {}", filePath);
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(filePath.toFile());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(resource);

        } catch (Exception e) {
            log.error("Error downloading file: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Import data from JSON file
     * POST /api/data/import
     */
    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importData(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean clearExistingData) {

        log.info("Received request to import data. Clear existing: {}, File: {}",
                clearExistingData, file.getOriginalFilename());

        Map<String, Object> response = new HashMap<>();

        try {
            // Validate file
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "No file provided");
                return ResponseEntity.badRequest().body(response);
            }

            if (!file.getOriginalFilename().toLowerCase().endsWith(".json")) {
                response.put("success", false);
                response.put("message", "Only JSON files are supported");
                return ResponseEntity.badRequest().body(response);
            }

            // Save uploaded file temporarily
            String tempFilename = "import_temp_" + System.currentTimeMillis() + ".json";
            Path tempFilePath = Paths.get(System.getProperty("java.io.tmpdir"), tempFilename);

            file.transferTo(tempFilePath.toFile());
            log.debug("Saved uploaded file to temporary location: {}", tempFilePath);

            try {
                // Perform import
                boolean success = dataImportService.importAllData(tempFilePath.toString(), clearExistingData);

                if (success) {
                    response.put("success", true);
                    response.put("message", "Data imported successfully");
                    response.put("clearExistingData", clearExistingData);
                    response.put("importedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

                    log.info("Data import completed successfully");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Failed to import data");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }

            } finally {
                // Clean up temporary file
                try {
                    Files.deleteIfExists(tempFilePath);
                    log.debug("Cleaned up temporary file: {}", tempFilePath);
                } catch (IOException e) {
                    log.warn("Failed to clean up temporary file: {}", e.getMessage());
                }
            }

        } catch (Exception e) {
            log.error("Error in import endpoint: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Import failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Preview import file without actually importing
     * POST /api/data/import/preview
     */
    @PostMapping("/import/preview")
    public ResponseEntity<Map<String, Object>> previewImport(@RequestParam("file") MultipartFile file) {
        log.info("Received request to preview import file: {}", file.getOriginalFilename());

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "No file provided"));
            }

            // Save uploaded file temporarily
            String tempFilename = "preview_temp_" + System.currentTimeMillis() + ".json";
            Path tempFilePath = Paths.get(System.getProperty("java.io.tmpdir"), tempFilename);

            file.transferTo(tempFilePath.toFile());

            try {
                Map<String, Object> preview = dataImportService.getImportPreview(tempFilePath.toString());
                preview.put("success", true);
                preview.put("filename", file.getOriginalFilename());

                return ResponseEntity.ok(preview);

            } finally {
                // Clean up temporary file
                try {
                    Files.deleteIfExists(tempFilePath);
                } catch (IOException e) {
                    log.warn("Failed to clean up temporary preview file: {}", e.getMessage());
                }
            }

        } catch (Exception e) {
            log.error("Error in import preview endpoint: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Preview failed: " + e.getMessage()));
        }
    }

    /**
     * Create a backup of all data
     * POST /api/data/backup
     */
    @PostMapping("/backup")
    public ResponseEntity<Map<String, Object>> createBackup() {
        log.info("Received request to create data backup");

        try {
            String backupFilePath = dataExportService.createBackup(defaultBackupDirectory);

            Map<String, Object> response = new HashMap<>();

            if (backupFilePath != null) {
                response.put("success", true);
                response.put("message", "Backup created successfully");
                response.put("backupFilePath", backupFilePath);
                response.put("backupDirectory", defaultBackupDirectory);
                response.put("createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

                // Add statistics
                response.put("statistics", dataExportService.getExportStatistics());

                log.info("Backup created successfully: {}", backupFilePath);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Failed to create backup");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

        } catch (Exception e) {
            log.error("Error in backup endpoint: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Backup failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get export statistics
     * GET /api/data/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        log.debug("Received request for export statistics");

        try {
            Map<String, Object> statistics = dataExportService.getExportStatistics();
            statistics.put("success", true);

            return ResponseEntity.ok(statistics);

        } catch (Exception e) {
            log.error("Error getting statistics: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get backup history and information
     * GET /api/data/backups
     */
    @GetMapping("/backups")
    public ResponseEntity<Map<String, Object>> getBackupHistory() {
        log.info("Received request for backup history");

        try {
            BackupSchedulerService.BackupInfo[] backups = backupSchedulerService.getBackupHistory();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("backups", backups);
            response.put("totalBackups", backups.length);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting backup history: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get backup history: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Trigger manual backup
     * POST /api/data/backup/manual
     */
    @PostMapping("/backup/manual")
    public ResponseEntity<Map<String, Object>> triggerManualBackup() {
        log.info("Received request for manual backup");

        try {
            String backupFilePath = backupSchedulerService.triggerManualBackup();

            Map<String, Object> response = new HashMap<>();

            if (backupFilePath != null) {
                response.put("success", true);
                response.put("message", "Manual backup created successfully");
                response.put("backupFilePath", backupFilePath);
                response.put("createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Failed to create manual backup");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

        } catch (Exception e) {
            log.error("Error in manual backup endpoint: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Manual backup failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Validate backup configuration
     * GET /api/data/backup/config
     */
    @GetMapping("/backup/config")
    public ResponseEntity<Map<String, Object>> getBackupConfiguration() {
        log.info("Received request for backup configuration");

        try {
            boolean isValid = backupSchedulerService.validateBackupConfiguration();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("configurationValid", isValid);
            response.put("backupDirectory", defaultBackupDirectory);
            response.put("exportDirectory", defaultExportDirectory);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting backup configuration: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get backup configuration: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
