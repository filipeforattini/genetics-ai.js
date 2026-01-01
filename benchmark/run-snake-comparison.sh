#!/bin/bash

# ============================================================================
# 🐍 SNAKE AGGRESSIVE BENCHMARK COMPARISON
# Comparação BRUTAL em cenário real!
# ============================================================================

set -e

echo "🐍 SNAKE AI - Aggressive Real-World Performance Comparison"
echo "============================================================"
echo ""
echo "⚠️  ATENÇÃO: Este benchmark vai demorar alguns minutos!"
echo "    Rodando 50 gerações com 100 indivíduos em CADA versão"
echo ""
read -p "Continuar? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Benchmark cancelado."
    exit 0
fi
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# ============================================================================
# 1. Verificar mudanças
# ============================================================================
echo "📋 Verificando estado do git..."

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo -e "${GREEN}✓${NC} Mudanças detectadas (versão otimizada)"
else
  echo -e "${RED}✗${NC} Nenhuma mudança detectada!"
  exit 1
fi

echo ""

# ============================================================================
# 2. OTIMIZADA - Rodar benchmark
# ============================================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 RODANDO VERSÃO OTIMIZADA${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

START_OPT=$(date +%s)
node --expose-gc benchmark/snake-aggressive.bench.js benchmark/results/snake-optimized.json
END_OPT=$(date +%s)
TIME_OPT=$((END_OPT - START_OPT))

echo ""
echo -e "${GREEN}✓${NC} Versão otimizada concluída em ${TIME_OPT}s"
echo ""

# ============================================================================
# 3. ORIGINAL - Stash e rodar benchmark
# ============================================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}⏳ Revertendo para versão ORIGINAL...${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

git stash push -m "snake-benchmark-temp" > /dev/null 2>&1

echo -e "${GREEN}✓${NC} Código revertido"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🐌 RODANDO VERSÃO ORIGINAL (pode demorar...)${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

START_ORIG=$(date +%s)
node --expose-gc benchmark/snake-aggressive.bench.js benchmark/results/snake-original.json
END_ORIG=$(date +%s)
TIME_ORIG=$((END_ORIG - START_ORIG))

echo ""
echo -e "${GREEN}✓${NC} Versão original concluída em ${TIME_ORIG}s"
echo ""

# ============================================================================
# 4. Restaurar otimizada
# ============================================================================
echo -e "${YELLOW}⏳${NC} Restaurando versão otimizada..."
git stash pop > /dev/null 2>&1
echo -e "${GREEN}✓${NC} Código otimizado restaurado"
echo ""

# ============================================================================
# 5. COMPARAÇÃO FINAL
# ============================================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📊 COMPARAÇÃO FINAL - SNAKE AI${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Ler JSONs
OPT_TIME=$(jq -r '.results.totalTime' benchmark/results/snake-optimized.json)
ORIG_TIME=$(jq -r '.results.totalTime' benchmark/results/snake-original.json)

OPT_PER_GEN=$(jq -r '.results.timePerGeneration' benchmark/results/snake-optimized.json)
ORIG_PER_GEN=$(jq -r '.results.timePerGeneration' benchmark/results/snake-original.json)

# Calcular speedup
SPEEDUP=$(echo "scale=2; $ORIG_TIME / $OPT_TIME" | bc)
IMPROVEMENT=$(echo "scale=2; (($ORIG_TIME - $OPT_TIME) / $ORIG_TIME) * 100" | bc)

echo "┌─────────────────────────────────────────────────────────┐"
echo "│                     TEMPO TOTAL                         │"
echo "├─────────────────────────────────────────────────────────┤"
printf "│  Original:   %12s ms                            │\n" "$ORIG_TIME"
printf "│  Otimizado:  %12s ms                            │\n" "$OPT_TIME"
printf "│  Speedup:    ${GREEN}%12s x${NC}                             │\n" "$SPEEDUP"
printf "│  Melhoria:   ${GREEN}%12s %%${NC}                            │\n" "$IMPROVEMENT"
echo "└─────────────────────────────────────────────────────────┘"
echo ""

echo "┌─────────────────────────────────────────────────────────┐"
echo "│                  TEMPO POR GERAÇÃO                      │"
echo "├─────────────────────────────────────────────────────────┤"
printf "│  Original:   %12s ms/gen                       │\n" "$ORIG_PER_GEN"
printf "│  Otimizado:  %12s ms/gen                       │\n" "$OPT_PER_GEN"
echo "└─────────────────────────────────────────────────────────┘"
echo ""

# Calcular economia em 1000 gerações
SAVING_1000=$(echo "scale=2; ($ORIG_PER_GEN - $OPT_PER_GEN) * 1000 / 1000" | bc)

echo -e "${CYAN}💡 IMPACTO REAL:${NC}"
echo "   Em 1000 gerações, você economiza ~${SAVING_1000}s ($(echo "scale=1; $SAVING_1000 / 60" | bc)min)"
echo ""

if (( $(echo "$SPEEDUP > 1.5" | bc -l) )); then
    echo -e "${GREEN}🔥 SPEEDUP MASSIVO! As otimizações são BRUTAIS!${NC}"
elif (( $(echo "$SPEEDUP > 1.2" | bc -l) )); then
    echo -e "${GREEN}⚡ SPEEDUP SIGNIFICATIVO! Vale muito a pena!${NC}"
else
    echo -e "${YELLOW}✓ Speedup moderado, mas ainda positivo!${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Benchmark Snake concluído!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📄 Resultados salvos em:"
echo "   • benchmark/results/snake-optimized.json"
echo "   • benchmark/results/snake-original.json"
echo ""
