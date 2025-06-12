describe('Manejo de Errores en Transacciones', () => {
    beforeEach(() => {
        // Mock user login
        cy.window().then((win) => {
            win.localStorage.setItem('user', JSON.stringify({
                name: 'Juan',
                lastname: 'Perez',
                mail: 'juan.test@example.com',
                cvu: 12345678901
            }));
        });
        
        // Setup basic interceptors
        cy.intercept('GET', '**/wallet/mine*', { fixture: 'wallet-data.json' }).as('getWallet');
        cy.intercept('GET', '**/transaction/*/history', { fixture: 'transaction-history.json' }).as('getHistory');
        
        cy.visit('/app/home');
        cy.wait('@getWallet');
        cy.wait('@getHistory');
    });

    describe('Errores de Transferencia P2P', () => {
        it('debe manejar error de CVUs iguales', () => {
            cy.intercept('POST', '**/transaction/transfer', {
                statusCode: 400,
                body: 'Payer and payee CVU cannot be the same.'
            }).as('sameCVUError');
            
            cy.intercept('GET', '**/wallet/valid/cvu*', { body: { valid: true } }).as('validateCVU');
            
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@sameCVUError');
            cy.contains('Payer and payee CVU cannot be the same.').should('be.visible');
        });

        it('debe manejar error de fondos insuficientes', () => {
            cy.intercept('POST', '**/transaction/transfer', {
                statusCode: 400,
                body: 'Juan Perez\'s wallet has insufficient funds.'
            }).as('insufficientFundsError');
            
            cy.intercept('GET', '**/wallet/valid/cvu*', { body: { valid: true } }).as('validateCVU');
            
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('2000');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@insufficientFundsError');
            cy.contains('Juan Perez\'s wallet has insufficient funds.').should('be.visible');
        });

        it('debe manejar error de billetera pagadora no encontrada', () => {
            cy.intercept('POST', '**/transaction/transfer', {
                statusCode: 404,
                body: 'Payer wallet with ID 12345678901 not found.'
            }).as('payerNotFoundError');
            
            cy.intercept('GET', '**/wallet/valid/cvu*', { body: { valid: true } }).as('validateCVU');
            
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@payerNotFoundError');
            cy.contains('Payer wallet with ID 12345678901 not found.').should('be.visible');
        });

        it('debe manejar error de billetera receptora no encontrada', () => {
            cy.intercept('POST', '**/transaction/transfer', {
                statusCode: 404,
                body: 'Payee wallet with ID 987654321098 not found.'
            }).as('payeeNotFoundError');
            
            cy.intercept('GET', '**/wallet/valid/cvu*', { body: { valid: true } }).as('validateCVU');
            
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@payeeNotFoundError');
            cy.contains('Payee wallet with ID 987654321098 not found.').should('be.visible');
        });

        it('debe manejar error de servicio externo', () => {
            cy.intercept('POST', '**/transaction/transfer', {
                statusCode: 503,
                body: 'External service error: Service temporarily unavailable'
            }).as('serviceError');
            
            cy.intercept('GET', '**/wallet/valid/cvu*', { body: { valid: true } }).as('validateCVU');
            
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@serviceError');
            cy.contains('External service error: Service temporarily unavailable').should('be.visible');
        });
    });

    describe('Errores de Extracción/Retiro', () => {
        it('debe manejar error de fondos insuficientes en retiro', () => {
            cy.intercept('POST', '**/transaction/withdrawal', {
                statusCode: 400,
                body: 'Juan Perez\'s wallet has insufficient funds.'
            }).as('insufficientFundsWithdrawal');
            
            cy.get('[data-testid="withdraw-button"]').click();
            cy.get('input[placeholder*="CVU cuenta externa"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('2000');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@insufficientFundsWithdrawal');
            cy.contains('Juan Perez\'s wallet has insufficient funds.').should('be.visible');
        });

        it('debe manejar error de solicitud de depósito inválida', () => {
            cy.intercept('POST', '**/transaction/withdrawal', {
                statusCode: 400,
                body: 'Invalid deposit request: Invalid CVU format'
            }).as('invalidDepositRequest');
            
            cy.get('[data-testid="withdraw-button"]').click();
            cy.get('input[placeholder*="CVU cuenta externa"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@invalidDepositRequest');
            cy.contains('Invalid deposit request: Invalid CVU format').should('be.visible');
        });

        it('debe manejar error de depósito externo fallido', () => {
            cy.intercept('POST', '**/transaction/withdrawal', {
                statusCode: 400,
                body: 'External deposit failed: Bank rejected transaction'
            }).as('externalDepositFailed');
            
            cy.get('[data-testid="withdraw-button"]').click();
            cy.get('input[placeholder*="CVU cuenta externa"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@externalDepositFailed');
            cy.contains('External deposit failed: Bank rejected transaction').should('be.visible');
        });

        it('debe manejar error de billetera interna no encontrada', () => {
            cy.intercept('POST', '**/transaction/withdrawal', {
                statusCode: 404,
                body: 'Internal wallet with ID 12345678901 not found.'
            }).as('internalWalletNotFound');
            
            cy.get('[data-testid="withdraw-button"]').click();
            cy.get('input[placeholder*="CVU cuenta externa"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@internalWalletNotFound');
            cy.contains('Internal wallet with ID 12345678901 not found.').should('be.visible');
        });

        it('debe manejar error de CVU externo no encontrado', () => {
            cy.intercept('POST', '**/transaction/withdrawal', {
                statusCode: 404,
                body: 'External CVU 987654321098 not found'
            }).as('externalCVUNotFound');
            
            cy.get('[data-testid="withdraw-button"]').click();
            cy.get('input[placeholder*="CVU cuenta externa"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@externalCVUNotFound');
            cy.contains('External CVU 987654321098 not found').should('be.visible');
        });

        it('debe manejar error de conexión con servicio externo', () => {
            cy.intercept('POST', '**/transaction/withdrawal', {
                statusCode: 503,
                body: 'Failed to connect to external wallet service: Connection timeout'
            }).as('connectionError');
            
            cy.get('[data-testid="withdraw-button"]').click();
            cy.get('input[placeholder*="CVU cuenta externa"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@connectionError');
            cy.contains('Failed to connect to external wallet service: Connection timeout').should('be.visible');
        });

        it('debe manejar error genérico de servicio externo', () => {
            cy.intercept('POST', '**/transaction/withdrawal', {
                statusCode: 503,
                body: 'External service error: Service maintenance in progress'
            }).as('genericServiceError');
            
            cy.get('[data-testid="withdraw-button"]').click();
            cy.get('input[placeholder*="CVU cuenta externa"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@genericServiceError');
            cy.contains('External service error: Service maintenance in progress').should('be.visible');
        });
    });

    describe('Errores de Red y Conectividad', () => {
        it('debe manejar error de red en transferencia', () => {
            cy.intercept('POST', '**/transaction/transfer', { forceNetworkError: true }).as('networkError');
            cy.intercept('GET', '**/wallet/valid/cvu*', { body: { valid: true } }).as('validateCVU');
            
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@networkError');
            cy.contains('Error de conexión').should('be.visible');
        });

        it('debe manejar error de red en retiro', () => {
            cy.intercept('POST', '**/transaction/withdrawal', { forceNetworkError: true }).as('networkErrorWithdrawal');
            
            cy.get('[data-testid="withdraw-button"]').click();
            cy.get('input[placeholder*="CVU cuenta externa"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            cy.wait('@networkErrorWithdrawal');
            cy.contains('Error de conexión').should('be.visible');
        });

        it('debe manejar timeout en validación de CVU', () => {
            cy.intercept('GET', '**/wallet/valid/cvu*', (req) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({ forceNetworkError: true });
                    }, 5000);
                });
            }).as('cvuTimeout');
            
            cy.get('[data-testid="transfer-button"]').click();
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            
            // Should show some loading state or error after timeout
            cy.wait('@cvuTimeout');
        });
    });

    describe('Validaciones de Formulario', () => {
        it('debe limpiar errores al corregir campos', () => {
            cy.get('[data-testid="transfer-button"]').click();
            
            // Trigger error
            cy.get('input[placeholder="Monto"]').type('100');
            cy.get('button').contains('Confirmar').click();
            cy.contains('CVU requerido').should('be.visible');
            
            // Fix error
            cy.get('input[placeholder*="CVU destino"]').type('987654321098');
            cy.get('button').contains('Confirmar').click();
            
            // Error should be cleared
            cy.contains('CVU requerido').should('not.exist');
        });
    });
});