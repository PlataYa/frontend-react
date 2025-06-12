#!/bin/bash

echo "🚀 Ejecutando Tests de Transacciones PlataYa - API Real"
echo "=================================================="

# Check if backend is running
echo "🔍 Verificando backend..."
if curl -s http://localhost:8080/api/v1/user/users > /dev/null; then
    echo "✅ Backend disponible en http://localhost:8080"
else
    echo "❌ Backend no disponible. Asegúrate de que esté ejecutándose en http://localhost:8080"
    exit 1
fi

# Check if frontend is running
echo "🔍 Verificando frontend..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend disponible en http://localhost:3000"
else
    echo "❌ Frontend no disponible. Asegúrate de que esté ejecutándose en http://localhost:3000"
    exit 1
fi

echo ""
echo "🧪 Ejecutando tests..."
echo ""

# Run specific test files
case "$1" in
    "transactions")
        echo "📊 Ejecutando tests de transacciones..."
        npx cypress run --spec "cypress/e2e/transactions.cy.ts"
        ;;
    "edge-cases")
        echo "🔍 Ejecutando tests de casos límite..."
        npx cypress run --spec "cypress/e2e/transaction-edge-cases.cy.ts"
        ;;
    "all")
        echo "🎯 Ejecutando todos los tests de transacciones..."
        npx cypress run --spec "cypress/e2e/transactions.cy.ts,cypress/e2e/transaction-edge-cases.cy.ts"
        ;;
    "open")
        echo "🖥️ Abriendo Cypress en modo interactivo..."
        npx cypress open
        ;;
    *)
        echo "Uso: $0 {transactions|edge-cases|all|open}"
        echo ""
        echo "Opciones:"
        echo "  transactions  - Solo tests de transacciones principales"
        echo "  edge-cases    - Solo tests de casos límite"
        echo "  all          - Todos los tests de transacciones"
        echo "  open         - Abrir Cypress en modo interactivo"
        exit 1
        ;;
esac

echo ""
echo "✅ Tests completados!" 