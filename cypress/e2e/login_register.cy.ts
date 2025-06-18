// cypress/e2e/login_register.cy.ts

describe('Flujo de Login y Registro', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.wait(300);
    });

    context('Registro', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/auth/register');
            cy.wait(300);
        });

        it('debe mostrar error si faltan campos obligatorios', () => {
            cy.get('#register-button').click();
            cy.contains('Todos los campos son obligatorios').should('exist');
            cy.wait(1500);
        });

        it('debe mostrar error si el nombre contiene símbolos', () => {
            cy.get('#register-name').type('Juan$%');
            cy.wait(200);
            cy.get('#register-lastname').type('Perez');
            cy.get('#register-email').type('juan@example.com');
            cy.get('#register-password').type('Abcdef1!');
            cy.get('#register-birthdate').type('2000-01-01');
            cy.get('#register-button').click();
            cy.contains('Nombre y apellido deben contener solo letras').should('exist');
            cy.wait(1500);
        });

        it('debe mostrar error si el email es inválido (sin @)', () => {
            cy.get('#register-name').type('Juan');
            cy.get('#register-lastname').type('Perez');
            cy.get('#register-email').type('juanexample.com');
            cy.get('#register-password').type('Abcdef1!');
            cy.get('#register-birthdate').type('2000-01-01');
            cy.wait(200);
            cy.get('#register-button').click();
            cy.contains('El email ingresado no es válido').should('exist');
            cy.wait(1500);
        });

        it('debe mostrar error si la contraseña es común o insegura', () => {
            cy.get('#register-name').type('Juan');
            cy.get('#register-lastname').type('Perez');
            cy.get('#register-email').type('juan@example.com');
            cy.get('#register-password').type('12345678');
            cy.get('#register-birthdate').type('2000-01-01');
            cy.get('#register-button').click();
            cy.contains('La contraseña debe tener al menos 8 caracteres').should('exist');
            cy.wait(1500);
        });

        it('debe mostrar error si la fecha es futura', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            const future = futureDate.toISOString().split('T')[0];

            cy.get('#register-name').type('Juan');
            cy.get('#register-lastname').type('Perez');
            cy.get('#register-email').type('juan@example.com');
            cy.get('#register-password').type('Abcdef1!');
            cy.get('#register-birthdate').type(future);
            cy.get('#register-button').click();
            cy.contains('La fecha ingresada no es válida').should('exist');
            cy.wait(1500);
        });

        it('debe mostrar error si el usuario es menor de edad', () => {
            cy.get('#register-name').type('Juan');
            cy.get('#register-lastname').type('Perez');
            cy.get('#register-email').type('juan@example.com');
            cy.get('#register-password').type('Abcdef1!');
            cy.get('#register-birthdate').type('2015-01-01');
            cy.get('#register-button').click();
            cy.contains('Debés tener al menos 18 años').should('exist');
            cy.wait(1500);
        });
    });

    context('Login', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/auth/login');
            cy.wait(500);
        });

        it('debe mostrar error si el email es inválido', () => {
            cy.get('#login-email').type('malemail', { delay: 100 });
            cy.get('#login-password').type('abc', { delay: 100 });
            cy.get('#login-button').click();
            cy.contains('Email inválido').should('exist');
            cy.wait(2000);
        });

        it('debe mostrar error si la contraseña es corta', () => {
            cy.get('#login-email').type('test@example.com');
            cy.get('#login-password').type('abc');
            cy.get('#login-button').click();
            cy.contains('La contraseña debe tener al menos 8 caracteres').should('exist');
            cy.wait(2000);
        });

        it('debe mostrar error si se deja el email vacío', () => {
            cy.get('#login-password').type('Password123');
            cy.get('#login-button').click();
            cy.contains('Todos los campos son obligatorios').should('exist');
            cy.wait(2000);
        });

        it('debe mostrar error si se deja la contraseña vacía', () => {
            cy.get('#login-email').type('test@example.com');
            cy.get('#login-button').click();
            cy.contains('Todos los campos son obligatorios').should('exist');
            cy.wait(2000);
        });

        it('debe bloquear el botón después de 5 intentos fallidos', () => {
            for (let i = 1; i < 5; i++) {
                cy.get('#login-email').clear().type('incorrect@example.com');
                cy.get('#login-password').clear().type('WrongPass1!');
                cy.get('#login-button').click();
                cy.wait(1000);
            }
            cy.contains('Demasiados intentos').should('exist');
            cy.get('#login-button').should('be.disabled');
            cy.wait(1000);
        });
    });
});
