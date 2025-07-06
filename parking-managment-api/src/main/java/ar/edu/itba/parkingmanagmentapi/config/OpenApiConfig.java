package ar.edu.itba.parkingmanagmentapi.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.parser.OpenAPIV3Parser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        try {
            // Leer el archivo openapi.yaml desde resources
            ClassPathResource resource = new ClassPathResource("openapi.yaml");
            String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            
            // Parsear el contenido YAML a objeto OpenAPI
            OpenAPIV3Parser parser = new OpenAPIV3Parser();
            return parser.readContents(content).getOpenAPI();
            
        } catch (IOException e) {
            throw new RuntimeException("Error al cargar el archivo openapi.yaml", e);
        }
    }
} 