#!/bin/bash

# Script para ejecutar Parking Management API
# Uso: ./run.sh [perfil]
# Perfiles: dev (default), local, prod

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración por defecto
PROFILE=${1:-dev}
PORT=8081

echo -e "${BLUE}=== Parking Management API ===${NC}"
echo -e "${YELLOW}Perfil: ${PROFILE}${NC}"
echo ""

echo -e "${BLUE}🚀 Iniciando aplicación...${NC}"
echo -e "${GREEN}URL: http://localhost:${PORT}/api${NC}"
echo -e "${GREEN}H2 Console: http://localhost:${PORT}/api/h2-console${NC}"
echo ""
echo -e "${YELLOW}Usuario de prueba para JWT:${NC}"
echo -e "  Email: laura.fernandez@outlook.com"
echo -e "  Password: password123"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener${NC}"
echo ""

mvn spring-boot:run -Dspring-boot.run.profiles=$PROFILE 