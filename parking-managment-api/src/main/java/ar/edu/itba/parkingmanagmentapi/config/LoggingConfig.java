package ar.edu.itba.parkingmanagmentapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.joran.JoranConfigurator;
import ch.qos.logback.core.util.StatusPrinter;
import org.slf4j.LoggerFactory;

@Configuration
public class LoggingConfig {

    @Bean
    @Profile("dev")
    public String configureDevLogging() {
        // Configuración de logging para desarrollo
        System.setProperty("logging.level.ar.edu.itba.parkingmanagmentapi", "DEBUG");
        System.setProperty("logging.level.org.springframework.web", "DEBUG");
        System.setProperty("logging.level.org.hibernate.SQL", "DEBUG");
        System.setProperty("logging.level.org.hibernate.type.descriptor.sql.BasicBinder", "TRACE");
        System.setProperty("logging.pattern.console", "%d{yyyy-MM-dd HH:mm:ss} - %msg%n");
        return "dev-logging-configured";
    }

    @Bean
    @Profile("prod")
    public String configureProdLogging() {
        // Configuración de logging para producción
        System.setProperty("logging.level.ar.edu.itba.parkingmanagmentapi", "INFO");
        System.setProperty("logging.level.org.springframework.web", "WARN");
        System.setProperty("logging.level.org.hibernate.SQL", "WARN");
        System.setProperty("logging.file.name", "logs/parking-management-api.log");
        System.setProperty("logging.pattern.file", "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n");
        return "prod-logging-configured";
    }

    @Bean
    @Profile("default")
    public String configureDefaultLogging() {
        // Configuración de logging por defecto
        System.setProperty("logging.level.ar.edu.itba.parkingmanagmentapi", "INFO");
        System.setProperty("logging.level.org.springframework.security", "DEBUG");
        System.setProperty("logging.level.org.hibernate.SQL", "DEBUG");
        System.setProperty("logging.level.org.hibernate.type.descriptor.sql.BasicBinder", "TRACE");
        System.setProperty("logging.pattern.console", "%d{yyyy-MM-dd HH:mm:ss} - %msg%n");
        return "default-logging-configured";
    }
} 