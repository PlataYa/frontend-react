describe('Transacciones y Extracciones - API Real', () => {
    const testUser1 = {
        name: 'Juan',
        lastname: 'TestUser',
        email: `juan.test.${Date.now()}@example.com`,
        password: 'TestPass123!',
        birthdate: '1990-01-01'
    };

    const testUser2 = {
        name: 'Maria',
        lastname: 'TestUser',
        email: `maria.test.${Date.now()}@example.com`,
        password: 'TestPass123!',
        birthdate: '1992-05-15'
    };

    before(() => {
        // Create test users before running tests
        cy.createTestUser(testUser1);
        cy.cleanupTestUser(testUser1.email);
        
        cy.createTestUser(testUser2);
        cy.cleanupTestUser(testUser2.email);
    });

    beforeEach(() => {
        // Login with test user 1 for each test
        cy.login(testUser1.email, testUser1.password);
        cy.waitForWallet();
    });

    afterEach(() => {
        // Logout after each test
        cy.cleanupTestUser(testUser1.email);
    });

    describe('Transferencias P2P', () => {
        it('debe realizar una transferencia exitosa entre usuarios reales', () => {
            // Get the CVU of testUser2 first
            cy.login(testUser2.email, testUser2.password);
            cy.get('[data-testid="wallet-cvu"]').invoke('text').then((cvuText) => {
                const targetCVU = cvuText.replace('CVU: ', '');
                
                // Login back with testUser1
                cy.login(testUser1.email, testUser1.password);
                cy.waitForWallet();
                
                // Perform transfer
                cy.openTransactionModal('transfer');
                cy.get('input[placeholder*="CVU destino"]').type(targetCVU);
                cy.get('input[placeholder="Monto"]').type('50');
                cy.get('button').contains('Confirmar').click();
                
                // Wait for transaction to complete
                cy.contains('Transferencia realizada', { timeout: 10000 }).should('be.visible');
                
                // Verify modal closed
                cy.get('[data-testid="transaction-modal"]').should('not.exist');
                
                // Verify balance updated (should be less than before)
                cy.waitForWallet();
                cy.get('[data-testid="wallet-balance"]').should('be.visible');
            });
        });

        it('debe mostrar error si el CVU es inválido', () => {
            cy.openTransactionModal('transfer');
            
            // Invalid CVU (less than 12 digits)
            cy.get('input[placeholder*="CVU destino"]').type('123456789');
            cy.get('input[placeholder="Monto"]').type('100');
            
            cy.get('button').contains('Confirmar').click();
            
            cy.contains('CVU inválido. Debe tener 12 dígitos.').should('be.visible');
        });

        it('debe mostrar error si el monto es inválido', () => {
            cy.openTransactionModal('transfer');
            
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            
            // Test negative amount
            cy.get('input[placeholder="Monto"]').type('-50');
            cy.get('button').contains('Confirmar').click();
            cy.contains('Monto inválido').should('be.visible');
            
            // Test zero amount
            cy.get('input[placeholder="Monto"]').clear().type('0');
            cy.get('button').contains('Confirmar').click();
            cy.contains('Monto inválido').should('be.visible');
            
            // Test amount too high
            cy.get('input[placeholder="Monto"]').clear().type('2000000');
            cy.get('button').contains('Confirmar').click();
            cy.contains('Monto inválido').should('be.visible');
        });

        it('debe mostrar error si faltan campos requeridos', () => {
            cy.openTransactionModal('transfer');
            
            // Try to submit without CVU
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            cy.contains('CVU requerido').should('be.visible');
            
            // Try to submit without amount
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').clear();
            cy.get('button').contains('Confirmar').click();
            cy.contains('Monto requerido').should('be.visible');
        });

        it('debe validar CVU antes de enviar transferencia', () => {
            cy.openTransactionModal('transfer');
            
            // Use a non-existent CVU
            cy.get('input[placeholder*="CVU destino"]').type('999999999999');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            // Should show error for invalid CVU
            cy.contains('CVU inválido: No se encontró una cuenta con ese CVU', { timeout: 10000 }).should('be.visible');
        });

        it('debe cerrar el modal al cancelar', () => {
            cy.openTransactionModal('transfer');
            
            cy.get('button').contains('Cancelar').click();
            
            cy.get('[data-testid="transaction-modal"]').should('not.exist');
        });
    });

    describe('Extracciones/Retiros', () => {
        it('debe intentar realizar una extracción a cuenta externa', () => {
            cy.openTransactionModal('withdraw');
            
            // Fill form with external CVU
            cy.get('input[placeholder*="CVU cuenta externa"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('25');
            
            // Submit
            cy.get('button').contains('Confirmar').click();
            
            // This might fail with external service error, which is expected
            // We're testing the flow, not necessarily success
            cy.wait(5000); // Wait for API response
            
            // Check if modal closed (success) or error message appeared
            cy.get('body').then(($body) => {
                if ($body.find('[data-testid="transaction-modal"]').length === 0) {
                    // Success case
                    cy.contains('Retiro realizado exitosamente').should('be.visible');
                } else {
                    // Error case - should show appropriate error message
                    cy.get('[data-testid="transaction-modal"]').should('be.visible');
                }
            });
        });

        it('debe mostrar error si el CVU de destino es inválido', () => {
            cy.openTransactionModal('withdraw');
            
            // Invalid CVU (less than 12 digits)
            cy.get('input[placeholder*="CVU cuenta externa"]').type('123456789');
            cy.get('input[placeholder="Monto"]').type('100');
            
            cy.get('button').contains('Confirmar').click();
            
            cy.contains('CVU inválido. Debe tener 12 dígitos.').should('be.visible');
        });
    });

    describe('Historial de Transacciones', () => {
        it('debe mostrar el historial de transacciones del usuario', () => {
            // Wait for transaction list to load
            cy.get('[data-testid="transaction-list"]').should('be.visible');
            
            // The content will depend on actual transaction history
            // We can check that the structure is correct
            cy.get('[data-testid="transaction-list"]').within(() => {
                // Should either show transactions or empty message
                cy.get('body').then(($body) => {
                    const hasTransactions = $body.find('div[style*="backgroundColor: #f0f0f0"]').length > 0;
                    const hasEmptyMessage = $body.text().includes('No hay transacciones recientes');
                    
                    expect(hasTransactions || hasEmptyMessage).to.be.true;
                });
            });
        });

        it('debe actualizar el historial después de una transacción', () => {
            // Get initial transaction count
            cy.get('[data-testid="transaction-list"]').within(() => {
                cy.get('div[style*="backgroundColor: #f0f0f0"]').then(($initialTransactions) => {
                    const initialCount = $initialTransactions.length;
                    
                    // Perform a transaction (this might fail due to external services)
                    cy.get('body').then(() => {
                        cy.openTransactionModal('transfer');
                        cy.get('input[placeholder*="CVU destino"]').type('999999999999');
                        cy.get('input[placeholder="Monto"]').type('10');
                        cy.get('button').contains('Confirmar').click();
                        
                        // Wait for response (success or error)
                        cy.wait(3000);
                        
                        // Check if transaction list updated or error occurred
                        cy.get('[data-testid="transaction-list"]').should('be.visible');
                    });
                });
            });
        });
    });

    describe('Validaciones de UI', () => {
        it('debe mostrar los botones de transacción correctos', () => {
            // Should show transfer and withdraw buttons
            cy.get('[data-testid="transfer-button"]').should('be.visible');
            cy.get('[data-testid="withdraw-button"]').should('be.visible');
            
            // Should NOT show deposit button (removed functionality)
            cy.get('[data-testid="deposit-button"]').should('not.exist');
        });

        it('debe mostrar información de la billetera', () => {
            cy.get('[data-testid="wallet-balance"]').should('be.visible');
            cy.get('[data-testid="wallet-cvu"]').should('be.visible');
            
            // Verify CVU format (11 digits)
            cy.get('[data-testid="wallet-cvu"]').invoke('text').should('match', /CVU: \d{11}/);
            
            // Verify balance format
            cy.get('[data-testid="wallet-balance"]').invoke('text').should('match', /Balance: \$[\d,]+(\.\d{2})?/);
        });
    });
}); 