package ar.edu.itba.parkingmanagmentapi.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

/**
 * Configuración principal de la aplicación que importa todas las demás configuraciones.
 * Esta clase centraliza la configuración de beans y permite una mejor organización.
 */
@EnableScheduling
@EnableAsync
@EnableTransactionManagement
@EnableWebMvc
@ComponentScan({
        "ar.edu.itba.parkingmanagmentapi.controller",
        "ar.edu.itba.parkingmanagmentapi.service",
        "ar.edu.itba.parkingmanagmentapi.repository",
        "ar.edu.itba.parkingmanagmentapi.model"
})
@Configuration
@Import({
    SecurityConfig.class,
    JpaConfig.class,
    DataSourceConfig.class,
    CorsConfig.class
})
public class AppConfig {
    // This class acts as the central configuration point
    // All specific configurations are in their respective classes
} 