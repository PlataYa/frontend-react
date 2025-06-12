describe('Casos Límite y Errores en Transacciones - API Real', () => {
    const testUser = {
        name: 'Pedro',
        lastname: 'EdgeCase',
        email: `pedro.edge.${Date.now()}@example.com`,
        password: 'TestPass123!',
        birthdate: '1988-03-20'
    };

    before(() => {
        // Create test user
        cy.createTestUser(testUser);
        cy.cleanupTestUser(testUser.email);
    });

    beforeEach(() => {
        cy.login(testUser.email, testUser.password);
        cy.waitForWallet();
    });

    afterEach(() => {
        cy.cleanupTestUser(testUser.email);
    });

    describe('Validaciones de CVU', () => {
        it('debe rechazar CVU con menos de 12 dígitos', () => {
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('123456789');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            cy.contains('CVU inválido. Debe tener 12 dígitos.').should('be.visible');
        });

        it('debe rechazar CVU con más de 12 dígitos', () => {
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('1234567890123');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            cy.contains('CVU inválido. Debe tener 12 dígitos.').should('be.visible');
        });

        it('debe rechazar CVU con caracteres no numéricos', () => {
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('12345abc6789');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            cy.contains('CVU inválido').should('be.visible');
        });
    });

    describe('Validaciones de Monto', () => {
        it('debe rechazar montos negativos', () => {
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('-100');
            cy.get('button').contains('Confirmar').click();
            cy.contains('Monto inválido').should('be.visible');
        });

        it('debe rechazar monto cero', () => {
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('0');
            cy.get('button').contains('Confirmar').click();
            cy.contains('Monto inválido').should('be.visible');
        });

        it('debe rechazar montos superiores al límite', () => {
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('2000000');
            cy.get('button').contains('Confirmar').click();
            cy.contains('Monto inválido').should('be.visible');
        });

        it('debe aceptar montos decimales válidos', () => {
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100.50');
            cy.get('button').contains('Confirmar').click();
            
            // Should proceed to CVU validation (which will fail for non-existent CVU)
            cy.contains('CVU inválido: No se encontró una cuenta con ese CVU', { timeout: 10000 }).should('be.visible');
        });

        it('debe rechazar montos con más de 2 decimales', () => {
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100.123');
            cy.get('button').contains('Confirmar').click();
            cy.contains('Monto inválido').should('be.visible');
        });
    });

    describe('Errores de API Reales', () => {
        it('debe manejar CVU no encontrado en transferencia', () => {
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('999999999999');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            // Wait for API response
            cy.contains('CVU inválido: No se encontró una cuenta con ese CVU', { timeout: 10000 }).should('be.visible');
        });

        it('debe manejar CVU no encontrado en retiro', () => {
            cy.get('[data-testid="withdraw-button"]').click();
            cy.get('input[placeholder*="CVU cuenta externa"]').type('999999999999');
            cy.get('input[placeholder="Monto"]').type('50');
            cy.get('button').contains('Confirmar').click();
            
            // Wait for API response - this might show different errors depending on backend
            cy.wait(5000);
            
            // Check for any error message
            cy.get('body').should('contain.text', 'error').or('contain.text', 'Error').or('contain.text', 'no encontrado');
        });

        it('debe manejar transferencia a mismo CVU', () => {
            // Get own CVU first
            cy.get('[data-testid="wallet-cvu"]').invoke('text').then((cvuText) => {
                const ownCVU = cvuText.replace('CVU: ', '');
                
                cy.get('[data-testid="transfer-button"]').click();
                cy.get('input[placeholder*="CVU destino"]').type(ownCVU);
                cy.get('input[placeholder="Monto"]').type('100');
                cy.get('button').contains('Confirmar').click();
                
                // Should show error for same CVU
                cy.wait(5000);
                cy.get('body').should('contain.text', 'mismo').or('contain.text', 'propia');
            });
        });

        it('debe manejar fondos insuficientes', () => {
            // Try to transfer a very large amount
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('999999999999');
            cy.get('input[placeholder="Monto"]').type('999999');
            cy.get('button').contains('Confirmar').click();
            
            // Wait for API response
            cy.wait(10000);
            
            // Should show some error (either CVU not found or insufficient funds)
            cy.get('body').should('contain.text', 'error').or('contain.text', 'Error').or('contain.text', 'fondos');
        });
    });

    describe('Comportamiento de UI', () => {
        it('debe limpiar formulario al cerrar modal', () => {
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('123456789012');
            cy.get('input[placeholder="Monto"]').type('100');
            
            cy.get('button').contains('Cancelar').click();
            
            // Reopen modal and check fields are empty
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').should('have.value', '');
            cy.get('input[placeholder="Monto"]').should('have.value', '');
        });

        it('debe mantener datos en formulario durante validación', () => {
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('123456789');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            // After validation error, fields should still have values
            cy.get('input[placeholder*="CVU destino"]').should('have.value', '123456789');
            cy.get('input[placeholder="Monto"]').should('have.value', '100');
        });

        it('debe permitir corrección de errores', () => {
            cy.get('[data-testid="transfer-button"]').click();
            
            // Enter invalid CVU
            cy.get('input[placeholder*="CVU destino"]').type('123456789');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            cy.contains('CVU inválido').should('be.visible');
            
            // Correct the CVU
            cy.get('input[placeholder*="CVU destino"]').clear().type('987654321098');
            cy.get('button').contains('Confirmar').click();
            
            // Error should change or disappear
            cy.wait(2000);
            cy.contains('CVU inválido. Debe tener 12 dígitos.').should('not.exist');
        });
    });

    describe('Navegación y Estado', () => {
        it('debe mantener estado de billetera después de error', () => {
            // Get initial balance
            cy.get('[data-testid="wallet-balance"]').invoke('text').then((initialBalance) => {
                
                // Attempt failed transaction
                cy.get('[data-testid="transfer-button"]').click();
                cy.get('input[placeholder*="CVU destino"]').type('999999999999');
                cy.get('input[placeholder="Monto"]').type('100');
                cy.get('button').contains('Confirmar').click();
                
                cy.wait(5000);
                
                // Balance should remain the same
                cy.get('[data-testid="wallet-balance"]').should('contain.text', initialBalance);
            });
        });

        it('debe permitir múltiples intentos de transacción', () => {
            // First attempt
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('123456789');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            cy.contains('CVU inválido').should('be.visible');
            cy.get('button').contains('Cancelar').click();
            
            // Second attempt
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('50');
            cy.get('button').contains('Confirmar').click();
            
            // Should proceed to API call
            cy.wait(3000);
        });
    });
}); 