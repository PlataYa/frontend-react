# Cypress Tests para Transacciones PlataYa - API Real

Este directorio contiene las pruebas end-to-end para las funcionalidades de transacciones y extracciones de PlataYa usando **llamadas reales a la API**.

## Estructura de Tests

### 📁 Archivos de Test

- **`transactions.cy.ts`** - Tests principales para transferencias P2P y extracciones con API real
- **`transaction-edge-cases.cy.ts`** - Tests para casos límite y validaciones con API real
- **`login_register.cy.ts`** - Tests existentes para autenticación

### 📁 Fixtures

- **`p2p-success.json`** - *(No usado - tests usan API real)*
- **`withdrawal-success.json`** - *(No usado - tests usan API real)*
- **`transaction-history.json`** - *(No usado - tests usan API real)*
- **`wallet-data.json`** - *(No usado - tests usan API real)*

### 📁 Support

- **`commands.ts`** - Comandos personalizados de Cypress
- **`e2e.ts`** - Configuración global de tests

## Comandos Personalizados

### `cy.login(email, password)`
Inicia sesión con un usuario específico.

### `cy.register(userData)`
Registra un nuevo usuario con los datos proporcionados.

### `cy.createTestUser(userData)`
Crea un usuario de prueba completo con billetera.

### `cy.cleanupTestUser(email)`
Limpia el usuario de prueba (logout).

### `cy.waitForWallet()`
Espera a que la billetera se cargue completamente.

### `cy.openTransactionModal(type)`
Abre el modal de transacción (transfer o withdraw).

## Ejecutar Tests

### Todos los tests
```bash
npx cypress run
```

### Tests específicos
```bash
# Solo tests de transacciones
npx cypress run --spec "cypress/e2e/transactions.cy.ts"

# Solo tests de casos límite
npx cypress run --spec "cypress/e2e/transaction-edge-cases.cy.ts"
```

### Modo interactivo
```bash
npx cypress open
```

## Escenarios Cubiertos

### ✅ Transferencias P2P
- Transferencia exitosa
- Validación de CVU inválido
- Validación de monto inválido
- Campos requeridos
- Errores de API (fondos insuficientes, CVU no encontrado, etc.)
- Validación de CVU antes de transferir

### ✅ Extracciones/Retiros
- Extracción exitosa a cuenta externa
- Validación de CVU de destino
- Errores específicos de extracción
- Manejo de errores de servicio externo

### ✅ Historial de Transacciones
- Visualización correcta del historial
- Diferentes tipos de transacciones
- Actualización después de transacciones
- Estado vacío

### ✅ Validaciones de UI
- Botones correctos (sin depósito)
- Información de billetera
- Estados de carga
- Manejo de errores

### ✅ Casos Límite
- Validaciones de CVU (longitud, formato)
- Validaciones de monto (negativos, cero, límites)
- Errores de red y conectividad
- Timeouts

## Datos de Prueba

### Usuario de Test
```json
{
  "name": "Juan",
  "lastname": "Perez",
  "email": "juan.test@example.com",
  "cvu": 12345678901
}
```

### CVUs de Prueba
- **CVU Válido**: 987654321098
- **CVU Inválido**: 123456789 (muy corto)
- **CVU Inválido**: 1234567890123 (muy largo)

### Montos de Prueba
- **Válidos**: 100, 150.75, 999999
- **Inválidos**: -100, 0, 2000000

## Configuración

### Variables de Entorno
- `REACT_APP_API_URL` - URL del backend (ej: `http://localhost:8080/api/v1`)
- Los tests están configurados para usar `http://localhost:8080/api/v1` por defecto

### Prerrequisitos
1. **Backend ejecutándose** en `http://localhost:8080` (o la URL configurada)
2. **Frontend ejecutándose** en `http://localhost:3000`
3. **Base de datos** disponible y configurada
4. Node.js y npm instalados

### ⚠️ Importante - API Real
Estos tests **NO usan mocks**. Realizan llamadas reales al backend, por lo que:
- Crean usuarios reales en la base de datos
- Realizan transacciones reales
- Requieren que el backend esté funcionando correctamente

## Troubleshooting

### Tests fallan por timeouts
- Aumenta `defaultCommandTimeout` en `cypress.config.ts`
- Verifica que la aplicación esté ejecutándose

### Elementos no encontrados
- Verifica que los `data-testid` estén presentes en los componentes
- Usa `cy.debug()` para inspeccionar el DOM

### Backend no responde
- Verifica que el backend esté ejecutándose en el puerto correcto
- Revisa que la base de datos esté disponible
- Confirma que `REACT_APP_API_URL` esté configurada correctamente

### Tests fallan por datos existentes
- Los tests crean usuarios únicos usando timestamps
- Si hay conflictos, reinicia la base de datos de pruebas

## Mejores Prácticas

1. **Usa data-testid** en lugar de clases CSS para seleccionar elementos
2. **Crea usuarios únicos** para evitar conflictos entre tests
3. **Limpia estado** entre tests con `beforeEach` y `afterEach`
4. **Agrupa tests** lógicamente con `describe`
5. **Maneja timeouts** apropiadamente para llamadas API reales
6. **Verifica estado real** de la aplicación después de operaciones 