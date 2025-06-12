describe('Validaciones en Login', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8081/auth/login');
    });

    it('valida email inválido', () => {
        cy.get('input[placeholder="Email"]').type('sinarroba');
        cy.get('input[placeholder="Contraseña"]').type('12345678');
        cy.contains('Iniciar Sesión').click();
        cy.contains('Email inválido');
    });

    it('valida contraseña muy corta', () => {
        cy.get('input[placeholder="Email"]').type('test@test.com');
        cy.get('input[placeholder="Contraseña"]').type('123');
        cy.contains('Iniciar Sesión').click();
        cy.contains('La contraseña debe tener al menos 8 caracteres');
    });

    it('bloquea tras 5 intentos fallidos', () => {
        for (let i = 0; i < 5; i++) {
            cy.get('input[placeholder="Email"]').clear().type('test@test.com');
            cy.get('input[placeholder="Contraseña"]').clear().type('WrongPass1!');
            cy.contains('Iniciar Sesión').click();
            cy.wait(300);
        }
        cy.contains('Demasiados intentos');
    });
});
