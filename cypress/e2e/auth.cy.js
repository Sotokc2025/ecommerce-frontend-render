// @ts-check
describe('Authentication Flow - Register & Login', () => {
    const uniqueEmail = `test_${Date.now()}@tymco.com`;

    beforeEach(() => {
        cy.visit('/');
    });

    it('Debe permitir registrar un nuevo usuario y loguearse automáticamente', () => {
        cy.visit('/login');

        // Login con un usuario conocido
        cy.get('#email').type('cliente@email.com');
        cy.get('#password').type('cliente123');
        cy.get('.login-form button[type="submit"]').click();

        // Verificar redirección al home
        cy.url().should('eq', Cypress.config().baseUrl + '/');
        // Verificar que el usuario está autenticado
        cy.get('.user-text', { timeout: 10000 }).should('contain', 'Hola,');
    });

    it('Debe mostrar error con credenciales inválidas', () => {
        cy.visit('/login');
        cy.get('#email').type('wrong@user.com');
        cy.get('#password').type('wrongpass');
        cy.get('.login-form button[type="submit"]').click();

        cy.get('.error-message', { timeout: 5000 }).should('be.visible');
    });
});
