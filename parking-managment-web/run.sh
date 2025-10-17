#!/bin/bash

# Script para ejecutar Parking Management Web
# Uso: ./run.sh [modo]
# Modos: dev (default), prod, build, preview

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración por defecto
MODE=${1:-dev}
PORT=5173

echo -e "${BLUE}=== Parking Management Web ===${NC}"
echo -e "${YELLOW}Modo: ${MODE}${NC}"
echo ""

# Verificar si node_modules existe, si no, instalar dependencias
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error instalando dependencias${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
    echo ""
fi

case $MODE in
    "dev")
        echo -e "${BLUE}🚀 Iniciando servidor de desarrollo...${NC}"
        echo -e "${GREEN}URL: http://localhost:${PORT}${NC}"
        echo ""
        echo -e "${YELLOW}Usuario de prueba:${NC}"
        echo -e "  Email: laura.fernandez@outlook.com"
        echo -e "  Password: password123"
        echo ""
        echo -e "${YELLOW}Presiona Ctrl+C para detener${NC}"
        echo ""
        npm run dev
        ;;
    "prod")
        echo -e "${BLUE}🚀 Iniciando servidor de producción...${NC}"
        echo -e "${GREEN}URL: http://localhost:${PORT}${NC}"
        echo ""
        echo -e "${YELLOW}Presiona Ctrl+C para detener${NC}"
        echo ""
        npm run prod
        ;;
    "build")
        echo -e "${BLUE}🔨 Construyendo aplicación...${NC}"
        npm run build
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Build completado exitosamente${NC}"
        else
            echo -e "${RED}❌ Error en el build${NC}"
            exit 1
        fi
        ;;
    "preview")
        echo -e "${BLUE}👀 Iniciando preview del build...${NC}"
        echo -e "${GREEN}URL: http://localhost:${PORT}${NC}"
        echo ""
        echo -e "${YELLOW}Presiona Ctrl+C para detener${NC}"
        echo ""
        npm run preview
        ;;
    *)
        echo -e "${RED}❌ Modo desconocido: $MODE${NC}"
        echo -e "${YELLOW}Modos disponibles: dev, prod, build, preview${NC}"
        exit 1
        ;;
esac
