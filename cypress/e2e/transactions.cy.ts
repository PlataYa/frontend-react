describe('Transacciones exitosas', () => {
    beforeEach(() => {
        cy.customLogin('martina@mail.com', 'Contraseña1!');
    });

    it('Transferencia válida', () => {
        cy.get('#transfer-button').click();
        cy.get('#cvu-input').type('100000000003');
        cy.get('#amount-input').type('200');
        cy.get('#submit-button').click();
        cy.contains('Transferencia realizada exitosamente').should('exist');
        cy.wait(2000);
    });


    it('Extracción válida', () => {
        cy.get('#withdraw-button').click();
        cy.get('#cvu-input').type('200000000005');
        cy.get('#amount-input').type('500');
        cy.get('#submit-button').click();
        cy.contains('Retiro realizado exitosamente').should('exist');
        cy.wait(2000);
    });

});
