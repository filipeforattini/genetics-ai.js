#!/bin/bash

# ============================================================================
# Performance Comparison Script
# Compara versão otimizada vs original automaticamente
# ============================================================================

set -e  # Exit on error

echo "🔥 Genetics AI - Performance Comparison Tool"
echo "============================================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# 1. Verificar se há mudanças não commitadas
# ============================================================================
echo "📋 Verificando estado do git..."

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo -e "${GREEN}✓${NC} Mudanças detectadas (versão otimizada)"
else
  echo -e "${RED}✗${NC} Nenhuma mudança detectada!"
  echo "   Este script compara a versão atual (otimizada) com a versão original."
  echo "   Por favor, faça suas otimizações antes de rodar este script."
  exit 1
fi

echo ""

# ============================================================================
# 2. Rodar benchmark na versão OTIMIZADA (current)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}▶${NC} Rodando benchmark na versão OTIMIZADA..."
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

node --expose-gc benchmark/compare.bench.js benchmark/results/optimized.json

echo ""
echo -e "${GREEN}✓${NC} Benchmark otimizado concluído!"
echo ""

# ============================================================================
# 3. Stash mudanças e rodar benchmark na versão ORIGINAL
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}▶${NC} Salvando mudanças e voltando para versão ORIGINAL..."
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Stash com mensagem
git stash push -m "benchmark-comparison-temp" > /dev/null 2>&1

echo -e "${GREEN}✓${NC} Código revertido para versão original"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}▶${NC} Rodando benchmark na versão ORIGINAL..."
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

node --expose-gc benchmark/compare.bench.js benchmark/results/original.json

echo ""
echo -e "${GREEN}✓${NC} Benchmark original concluído!"
echo ""

# ============================================================================
# 4. Restaurar mudanças (versão otimizada)
# ============================================================================
echo -e "${YELLOW}▶${NC} Restaurando versão otimizada..."

git stash pop > /dev/null 2>&1

echo -e "${GREEN}✓${NC} Código otimizado restaurado"
echo ""

# ============================================================================
# 5. Gerar relatório de comparação
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}▶${NC} Gerando relatório comparativo..."
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

node benchmark/generate-report.js

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Comparação concluída com sucesso!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📊 Resultados salvos em:"
echo "   • benchmark/results/optimized.json"
echo "   • benchmark/results/original.json"
echo "   • PERFORMANCE_REPORT.md"
echo ""
echo "📖 Leia o relatório completo em: PERFORMANCE_REPORT.md"
echo ""
