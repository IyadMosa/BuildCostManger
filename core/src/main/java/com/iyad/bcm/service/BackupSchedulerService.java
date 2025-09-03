package com.iyad.bcm.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Comparator;

/**
 * Service responsible for automated backup scheduling and backup management
 * Runs daily backups and manages backup retention policies
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BackupSchedulerService {

    private final DataExportService dataExportService;

    @Value("${app.backup.directory:${user.home}/buildcostmanager/backups}")
    private String backupDirectory;

    @Value("${app.backup.retention.days:30}")
    private int retentionDays;

    @Value("${app.backup.enabled:true}")
    private boolean backupEnabled;

    /**
     * Scheduled method that runs daily at 2:00 AM to create automatic backups
     * Cron expression: 0 0 2 * * * (second, minute, hour, day of month, month, day of week)
     */
    @Scheduled(cron = "${app.backup.schedule:0 0 2 * * *}")
    public void performDailyBackup() {
        if (!backupEnabled) {
            log.debug("Automated backup is disabled");
            return;
        }

        log.info("Starting scheduled daily backup at {}", LocalDateTime.now());

        try {
            // Create backup
            String backupFilePath = dataExportService.createBackup(backupDirectory);

            if (backupFilePath != null) {
                log.info("Scheduled backup completed successfully: {}", backupFilePath);

                // Clean up old backups
                cleanupOldBackups();

            } else {
                log.error("Scheduled backup failed");
                // TODO: Consider sending notifications or alerts for backup failures
            }

        } catch (Exception e) {
            log.error("Error during scheduled backup: {}", e.getMessage(), e);
            // TODO: Consider sending notifications or alerts for backup failures
        }
    }

    /**
     * Cleans up old backup files based on retention policy
     */
    private void cleanupOldBackups() {
        log.debug("Starting cleanup of old backup files older than {} days", retentionDays);

        try {
            Path backupDir = Paths.get(backupDirectory);

            if (!Files.exists(backupDir)) {
                log.debug("Backup directory does not exist, skipping cleanup");
                return;
            }

            // Get all backup files
            File[] backupFiles = backupDir.toFile().listFiles((dir, name) ->
                name.startsWith("backup_") && name.endsWith(".json"));

            if (backupFiles == null || backupFiles.length == 0) {
                log.debug("No backup files found for cleanup");
                return;
            }

            // Calculate cutoff time
            LocalDateTime cutoffTime = LocalDateTime.now().minusDays(retentionDays);
            log.debug("Cutoff time for backup cleanup: {}", cutoffTime);

            int deletedCount = 0;

            for (File backupFile : backupFiles) {
                try {
                    // Extract timestamp from filename
                    String filename = backupFile.getName();
                    String timestampStr = filename.replace("backup_", "").replace(".json", "");

                    // Parse timestamp (format: yyyy-MM-dd_HH-mm-ss)
                    LocalDateTime fileTime = LocalDateTime.parse(timestampStr,
                            DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));

                    if (fileTime.isBefore(cutoffTime)) {
                        boolean deleted = backupFile.delete();
                        if (deleted) {
                            deletedCount++;
                            log.debug("Deleted old backup file: {}", filename);
                        } else {
                            log.warn("Failed to delete old backup file: {}", filename);
                        }
                    }

                } catch (Exception e) {
                    log.warn("Error processing backup file {} for cleanup: {}",
                            backupFile.getName(), e.getMessage());
                }
            }

            if (deletedCount > 0) {
                log.info("Cleanup completed. Deleted {} old backup files", deletedCount);
            } else {
                log.debug("No old backup files to delete");
            }

        } catch (Exception e) {
            log.error("Error during backup cleanup: {}", e.getMessage(), e);
        }
    }

    /**
     * Manually triggers a backup (can be called from REST API or other services)
     * @return the path of the created backup file, or null if failed
     */
    public String triggerManualBackup() {
        log.info("Manual backup triggered at {}", LocalDateTime.now());

        try {
            String backupFilePath = dataExportService.createBackup(backupDirectory);

            if (backupFilePath != null) {
                log.info("Manual backup completed successfully: {}", backupFilePath);
                return backupFilePath;
            } else {
                log.error("Manual backup failed");
                return null;
            }

        } catch (Exception e) {
            log.error("Error during manual backup: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Gets information about existing backup files
     * @return array of backup file information
     */
    public BackupInfo[] getBackupHistory() {
        log.debug("Retrieving backup history from directory: {}", backupDirectory);

        try {
            Path backupDir = Paths.get(backupDirectory);

            if (!Files.exists(backupDir)) {
                log.debug("Backup directory does not exist");
                return new BackupInfo[0];
            }

            File[] backupFiles = backupDir.toFile().listFiles((dir, name) ->
                name.startsWith("backup_") && name.endsWith(".json"));

            if (backupFiles == null || backupFiles.length == 0) {
                log.debug("No backup files found");
                return new BackupInfo[0];
            }

            // Sort files by modification time (newest first)
            Arrays.sort(backupFiles, Comparator.comparingLong(File::lastModified).reversed());

            BackupInfo[] backupInfos = new BackupInfo[backupFiles.length];

            for (int i = 0; i < backupFiles.length; i++) {
                File file = backupFiles[i];
                BackupInfo info = new BackupInfo();
                info.setFilename(file.getName());
                info.setFilePath(file.getAbsolutePath());
                info.setSize(file.length());
                info.setCreatedAt(LocalDateTime.ofInstant(
                        java.time.Instant.ofEpochMilli(file.lastModified()),
                        java.time.ZoneId.systemDefault()));

                // Try to parse timestamp from filename
                try {
                    String timestampStr = file.getName().replace("backup_", "").replace(".json", "");
                    info.setTimestamp(LocalDateTime.parse(timestampStr,
                            DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss")));
                } catch (Exception e) {
                    log.debug("Could not parse timestamp from filename: {}", file.getName());
                    info.setTimestamp(info.getCreatedAt());
                }

                backupInfos[i] = info;
            }

            log.debug("Found {} backup files", backupInfos.length);
            return backupInfos;

        } catch (Exception e) {
            log.error("Error retrieving backup history: {}", e.getMessage(), e);
            return new BackupInfo[0];
        }
    }

    /**
     * Data class for backup file information
     */
    public static class BackupInfo {
        private String filename;
        private String filePath;
        private long size;
        private LocalDateTime createdAt;
        private LocalDateTime timestamp;

        // Getters and setters
        public String getFilename() { return filename; }
        public void setFilename(String filename) { this.filename = filename; }

        public String getFilePath() { return filePath; }
        public void setFilePath(String filePath) { this.filePath = filePath; }

        public long getSize() { return size; }
        public void setSize(long size) { this.size = size; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

        public String getFormattedSize() {
            if (size < 1024) return size + " B";
            else if (size < 1024 * 1024) return String.format("%.1f KB", size / 1024.0);
            else return String.format("%.1f MB", size / (1024.0 * 1024.0));
        }
    }

    /**
     * Validates backup configuration
     * @return true if configuration is valid
     */
    public boolean validateBackupConfiguration() {
        log.debug("Validating backup configuration...");

        try {
            // Check if backup directory can be created
            Path backupDir = Paths.get(backupDirectory);
            if (!Files.exists(backupDir)) {
                Files.createDirectories(backupDir);
                log.info("Created backup directory: {}", backupDirectory);
            }

            // Check if directory is writable
            if (!Files.isWritable(backupDir)) {
                log.error("Backup directory is not writable: {}", backupDirectory);
                return false;
            }

            // Validate retention days
            if (retentionDays <= 0) {
                log.warn("Invalid retention days configuration: {}. Using default value of 30.", retentionDays);
                retentionDays = 30;
            }

            log.info("Backup configuration validated successfully. Directory: {}, Retention: {} days, Enabled: {}",
                    backupDirectory, retentionDays, backupEnabled);
            return true;

        } catch (IOException e) {
            log.error("Error validating backup configuration: {}", e.getMessage(), e);
            return false;
        }
    }
}
