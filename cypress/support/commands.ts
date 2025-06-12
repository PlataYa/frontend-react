/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Custom command to login a user
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/auth/login');
    cy.get('#login-email').type(email);
    cy.get('#login-password').type(password);
    cy.get('#login-button').click();
    cy.url().should('include', '/app/home');
    cy.wait(2000); // Wait for wallet to load from real API
});

// Custom command to register a user
Cypress.Commands.add('register', (userData: {
    name: string;
    lastname: string;
    email: string;
    password: string;
    birthdate: string;
}) => {
    cy.visit('/auth/register');
    cy.get('#register-name').type(userData.name);
    cy.get('#register-lastname').type(userData.lastname);
    cy.get('#register-email').type(userData.email);
    cy.get('#register-password').type(userData.password);
    cy.get('#register-birthdate').type(userData.birthdate);
    cy.get('#register-button').click();
});

// Custom command to wait for wallet to load from real API
Cypress.Commands.add('waitForWallet', () => {
    cy.contains('Cargando billetera...').should('not.exist');
    cy.get('[data-testid="wallet-balance"]').should('be.visible');
    cy.wait(1000); // Additional wait for API response
});

// Custom command to open transaction modal
Cypress.Commands.add('openTransactionModal', (type: 'transfer' | 'withdraw') => {
    if (type === 'transfer') {
        cy.get('[data-testid="transfer-button"]').click();
    } else {
        cy.get('[data-testid="withdraw-button"]').click();
    }
    cy.get('[data-testid="transaction-modal"]').should('be.visible');
});

// Custom command to create a test user with wallet
Cypress.Commands.add('createTestUser', (userData: {
    name: string;
    lastname: string;
    email: string;
    password: string;
    birthdate: string;
}) => {
    // Register the user
    cy.register(userData);
    
    // Wait for registration to complete
    cy.url().should('include', '/auth/login');
    
    // Login with the new user
    cy.login(userData.email, userData.password);
    
    // Wait for wallet creation and loading
    cy.waitForWallet();
});

// Custom command to cleanup test user (if needed)
Cypress.Commands.add('cleanupTestUser', (email: string) => {
    // This would require a cleanup endpoint in the backend
    // For now, we'll just log out
    cy.get('button').contains('Cerrar sesión').click();
});

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>
            register(userData: {
                name: string;
                lastname: string;
                email: string;
                password: string;
                birthdate: string;
            }): Chainable<void>
            waitForWallet(): Chainable<void>
            openTransactionModal(type: 'transfer' | 'withdraw'): Chainable<void>
            createTestUser(userData: {
                name: string;
                lastname: string;
                email: string;
                password: string;
                birthdate: string;
            }): Chainable<void>
            cleanupTestUser(email: string): Chainable<void>
        }
    }
}