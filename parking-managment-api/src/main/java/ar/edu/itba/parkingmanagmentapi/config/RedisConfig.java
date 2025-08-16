package ar.edu.itba.parkingmanagmentapi.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.utility.DockerImageName;

@Configuration
public class RedisConfig {
    private static final Logger logger = LoggerFactory.getLogger(RedisConfig.class);

    @Bean
    @Profile({"dev", "test"})
    public LettuceConnectionFactory redisDevConnectionFactory() {
        logger.info("Starting Redis TestContainer for dev/test profile");
        
        GenericContainer<?> redisContainer = new GenericContainer<>(
                DockerImageName.parse("redis:7-alpine")
        ).withExposedPorts(6379);
        
        redisContainer.start();
        
        String host = redisContainer.getHost();
        int port = redisContainer.getMappedPort(6379);
        
        logger.info("Redis TestContainer started successfully - Host: {}, Port: {}", host, port);
        
        RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration(host, port);
        return new LettuceConnectionFactory(configuration);
    }

    @Bean
    @Profile({"local", "prod"})
    public LettuceConnectionFactory redisProductionConnectionFactory(
            @Value("${redis.host:localhost}") String host,
            @Value("${redis.port:6379}") int port,
            @Value("${redis.password:}") String password,
            @Value("${redis.database:0}") int database,
            @Value("${redis.timeout:2000}") int timeout) {
        
        logger.info("Starting Redis connection for local/prod profile");

        RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration();
        configuration.setHostName(host);
        configuration.setPort(port);
        configuration.setPassword(password);
        configuration.setDatabase(database);
        
        logger.info("Redis started successfully - Host: {}, Port: {}", host, port);

        return new LettuceConnectionFactory(configuration);
    }
}