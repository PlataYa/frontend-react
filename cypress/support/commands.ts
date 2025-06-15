Cypress.Commands.add('customLogin', (email, password) => {
    cy.visit('/auth/login');

    cy.get('#login-email').clear().type(email);
    cy.get('#login-password').clear().type(password);
    cy.get('#login-button').click();

    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
    cy.wait(2000);
});

let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add('saveLocalStorage', () => {
    Object.keys(localStorage).forEach(key => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key];
    });
});

Cypress.Commands.add('restoreLocalStorage', () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
        localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
    });
});

