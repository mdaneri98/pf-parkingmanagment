# ==============================================================================
# Multi-stage Dockerfile for Parking Management API
# Supports three profiles: local (H2), dev (PostgreSQL), prod (PostgreSQL)
# ==============================================================================

# ---------- BUILD STAGE ----------
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy the built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership to non-root user
RUN chown -R spring:spring /app

# Switch to non-root user
USER spring:spring

# Expose the application port (matches application.yml server.port: 3000)
EXPOSE 3000

# Environment variables with sensible defaults
ENV SPRING_PROFILES_ACTIVE=dev \
    JAVA_OPTS="-Xms256m -Xmx512m" \
    SPRING_DATASOURCE_URL="" \
    SPRING_DATASOURCE_USERNAME="" \
    SPRING_DATASOURCE_PASSWORD="" \
    REDIS_HOST=localhost \
    REDIS_PORT=6379 \
    REDIS_PASSWORD="" \
    JWT_SECRET="" \
    JWT_EXPIRATION=86400000 \
    SERVER_PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/actuator/health || exit 1

# Run the application with environment variable support
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS \
    -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE} \
    ${SPRING_DATASOURCE_URL:+-Dspring.datasource.url=${SPRING_DATASOURCE_URL}} \
    ${SPRING_DATASOURCE_USERNAME:+-Dspring.datasource.username=${SPRING_DATASOURCE_USERNAME}} \
    ${SPRING_DATASOURCE_PASSWORD:+-Dspring.datasource.password=${SPRING_DATASOURCE_PASSWORD}} \
    ${REDIS_HOST:+-Dredis.host=${REDIS_HOST}} \
    ${REDIS_PORT:+-Dredis.port=${REDIS_PORT}} \
    ${REDIS_PASSWORD:+-Dredis.password=${REDIS_PASSWORD}} \
    ${JWT_SECRET:+-Djwt.secret=${JWT_SECRET}} \
    ${JWT_EXPIRATION:+-Djwt.expiration=${JWT_EXPIRATION}} \
    -Dserver.port=${SERVER_PORT} \
    -jar app.jar"]
