package ar.edu.itba.parkingmanagmentapi.config;

import org.springframework.context.annotation.Configuration;

/**
 * Logging configuration is now handled through application.yml files
 * for each profile instead of programmatic configuration.
 * 
 * This approach is more maintainable and follows Spring Boot conventions.
 */
@Configuration
public class LoggingConfig {
    // Logging configuration is now externalized to application.yml files
    // This provides better separation of concerns and easier maintenance
} 