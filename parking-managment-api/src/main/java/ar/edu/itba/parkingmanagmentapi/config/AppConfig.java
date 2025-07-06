package ar.edu.itba.parkingmanagmentapi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * Configuración principal de la aplicación que importa todas las demás configuraciones.
 * Esta clase centraliza la configuración de beans y permite una mejor organización.
 */
@Configuration
@Import({
    SecurityConfig.class,
    JpaConfig.class,
    DataSourceConfig.class,
    CorsConfig.class
})
public class AppConfig {
    // Esta clase actúa como punto central de configuración
    // Todas las configuraciones específicas están en sus respectivas clases
} 