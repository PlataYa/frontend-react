describe('Errores en transacciones', () => {

    before(() => {
        cy.visit('http://localhost:3000/auth/login');
        cy.customLogin('martina@mail.com', 'Contraseña1!');
        cy.url().should('include', '/');
        cy.wait(1000);
        cy.saveLocalStorage(); // guardamos sesión
    });

    beforeEach(() => {
        cy.restoreLocalStorage(); // recuperamos sesión
        cy.visit('http://localhost:3000/');
        cy.wait(1000);
    });

    context('Errores comunes en extracciones', () => {
        it('Todos los campos son obligatorios.', () => {
            cy.get('#withdraw-button').click();
            cy.get('#submit-button').click();
            cy.contains(/Todos los campos son obligatorios/i).should('exist');
            cy.wait(2000);
        });

        it('Monto requerido.', () => {
            cy.get('#withdraw-button').click();
            cy.get('#cvu-input').type('100000000000');
            cy.get('#submit-button').click();
            cy.contains('Monto requerido. Por favor, ingrese un monto.').should('exist');
            cy.wait(2000);
        });

        it('CVU requerido.', () => {
            cy.get('#withdraw-button').click();
            cy.get('#amount-input').type('100');
            cy.get('#submit-button').click();
            cy.contains('CVU requerido. Por favor, ingrese un CVU.').should('exist');
            cy.wait(2000);
        });

        it('Monto negativo al depositar', () => {
            cy.get('#withdraw-button').click();
            cy.get('#cvu-input').type('100000000000');
            cy.get('#amount-input').type('-100');
            cy.get('#submit-button').click();
            cy.contains('Monto inválido.').should('exist');
            cy.wait(2000);
        });

        it('CVU inválido al depositar', () => {
            cy.get('#withdraw-button').click();
            cy.get('#cvu-input').type('123456789012');
            cy.get('#amount-input').type('100');
            cy.get('#submit-button').click();
            cy.contains('CVU inválido: No se encontró una cuenta con ese CVU').should('exist');
            cy.wait(2000);
        });

        it('Saldo insuficiente para extracción', () => {
            cy.get('#withdraw-button').click();
            cy.get('#cvu-input').type('200000000005');
            cy.get('#amount-input').type('1000000');
            cy.get('#submit-button').click();
            cy.contains('Saldo insuficiente').should('exist');
            cy.wait(2000);
        });
    });

    context('Errores comunes en transferencias', () => {
        it('Todos los campos son obligatorios.', () => {
            cy.get('#transfer-button').click();
            cy.get('#submit-button').click();
            cy.contains(/Todos los campos son obligatorios/i).should('exist');
            cy.wait(2000);
        });

        it('Monto requerido.', () => {
            cy.get('#transfer-button').click();
            cy.get('#cvu-input').type('100000000002');
            cy.get('#submit-button').click();
            cy.contains('Monto requerido. Por favor, ingrese un monto.').should('exist');
            cy.wait(2000);
        });

        it('CVU requerido.', () => {
            cy.get('#transfer-button').click();
            cy.get('#amount-input').type('100');
            cy.get('#submit-button').click();
            cy.contains('CVU requerido. Por favor, ingrese un CVU.').should('exist');
            cy.wait(2000);
        });

        it('Monto negativo al transferir', () => {
            cy.get('#transfer-button').click();
            cy.get('#cvu-input').type('100000000002');
            cy.get('#amount-input').type('-100');
            cy.get('#submit-button').click();
            cy.contains('Monto inválido.').should('exist');
            cy.wait(2000);
        });

        it('CVU de PlataYa debe tener 12 dígitos', () => {
            cy.get('#transfer-button').click();
            cy.get('#cvu-input').type('1234567890');
            cy.get('#amount-input').type('100');
            cy.get('#submit-button').click();
            cy.contains('CVU inválido. Debe tener 12 dígitos.').should('exist');
            cy.wait(2000);
        });

        it('CVU inválido al transferir', () => {
            cy.get('#transfer-button').click();
            cy.get('#cvu-input').type('123456789012');
            cy.get('#amount-input').type('100');
            cy.get('#submit-button').click();
            cy.contains('CVU inválido: No se encontró una cuenta con ese CVU').should('exist');
            cy.wait(2000);
        });

        it('Saldo insuficiente para transferencia', () => {
            cy.get('#transfer-button').click();
            cy.get('#cvu-input').type('100000000002');
            cy.get('#amount-input').type('1000000');
            cy.get('#submit-button').click();
            cy.contains('Saldo insuficiente').should('exist');
            cy.wait(2000);
        });
    });
});
