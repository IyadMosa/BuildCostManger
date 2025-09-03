package com.iyad.bcm.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Configuration class for JSON serialization and application settings
 * Configures ObjectMapper for proper JSON handling and enables scheduling
 */
@Configuration
@EnableScheduling
public class DataExportImportConfig {

    /**
     * Configures ObjectMapper bean for JSON serialization/deserialization
     * Handles Java 8 time types and prevents issues with lazy loading
     */
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        // Register JavaTimeModule for Java 8 time support
        mapper.registerModule(new JavaTimeModule());

        // Configure serialization settings
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        mapper.configure(SerializationFeature.INDENT_OUTPUT, true);

        // Handle Jackson issues with Hibernate lazy loading
        mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        return mapper;
    }
}
