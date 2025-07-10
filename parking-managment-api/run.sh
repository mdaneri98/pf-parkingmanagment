#!/bin/bash

# Script para ejecutar Parking Management API
# Uso: ./run.sh [perfil] [modo]
# Perfiles: dev (default), default
# Modos: run (default), build, test, clean

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración por defecto
PROFILE=${1:-dev}
MODE=${2:-run}
PORT=8081

echo -e "${BLUE}=== Parking Management API ===${NC}"
echo -e "${YELLOW}Perfil: ${PROFILE}${NC}"
echo -e "${YELLOW}Modo: ${MODE}${NC}"
echo ""

case $MODE in
    "clean")
        echo -e "${BLUE}🧹 Limpiando proyecto...${NC}"
        mvn clean
        ;;
    "build")
        echo -e "${BLUE}🔨 Compilando proyecto...${NC}"
        mvn clean compile
        ;;
    "test")
        echo -e "${BLUE}🧪 Ejecutando tests...${NC}"
        mvn test -Dspring.profiles.active=$PROFILE
        ;;
    "package")
        echo -e "${BLUE}📦 Empaquetando aplicación...${NC}"
        mvn clean package -DskipTests
        ;;
    "run")
        echo -e "${BLUE}🚀 Iniciando aplicación...${NC}"
        echo -e "${GREEN}URL: http://localhost:${PORT}/api${NC}"
        echo -e "${GREEN}Swagger: http://localhost:${PORT}/api/swagger-ui.html${NC}"
        echo -e "${GREEN}H2 Console: http://localhost:${PORT}/api/h2-console${NC}"
        echo ""
        echo -e "${YELLOW}Usuario de prueba para JWT:${NC}"
        echo -e "  Username: pepe"
        echo -e "  Password: 1234"
        echo ""
        echo -e "${YELLOW}Presiona Ctrl+C para detener${NC}"
        echo ""
        mvn spring-boot:run -Dspring-boot.run.profiles=$PROFILE
        ;;
    "jar")
        echo -e "${BLUE}📦 Empaquetando y ejecutando JAR...${NC}"
        mvn clean package -DskipTests
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ JAR creado exitosamente${NC}"
            echo -e "${BLUE}🚀 Ejecutando JAR...${NC}"
            java -jar target/parking-managment-api-0.0.1-SNAPSHOT.war --spring.profiles.active=$PROFILE
        else
            echo -e "${RED}❌ Error al crear JAR${NC}"
            exit 1
        fi
        ;;
    "help")
        echo -e "${GREEN}Uso: ./run.sh [perfil] [modo]${NC}"
        echo ""
        echo -e "${YELLOW}Perfiles disponibles:${NC}"
        echo "  dev      - Desarrollo con H2 (por defecto)"
        echo "  default  - Configuración por defecto"
        echo ""
        echo -e "${YELLOW}Modos disponibles:${NC}"
        echo "  run      - Ejecutar aplicación (por defecto)"
        echo "  build    - Solo compilar"
        echo "  test     - Ejecutar tests"
        echo "  package  - Crear JAR/WAR"
        echo "  jar      - Crear y ejecutar JAR"
        echo "  clean    - Limpiar proyecto"
        echo "  help     - Mostrar esta ayuda"
        echo ""
        echo -e "${YELLOW}Ejemplos:${NC}"
        echo "  ./run.sh                    # Ejecutar con perfil dev"
        echo "  ./run.sh dev run           # Ejecutar con perfil dev"
        echo "  ./run.sh default run       # Ejecutar con perfil default"
        echo "  ./run.sh dev build         # Solo compilar"
        echo "  ./run.sh dev test          # Ejecutar tests"
        echo "  ./run.sh dev package       # Crear JAR"
        ;;
    *)
        echo -e "${RED}❌ Modo desconocido: $MODE${NC}"
        echo -e "${YELLOW}Usa './run.sh help' para ver los modos disponibles${NC}"
        exit 1
        ;;
esac 