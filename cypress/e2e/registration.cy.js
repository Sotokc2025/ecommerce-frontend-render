describe('Flujo de Autenticación - Registro', () => {
    const timestamp = Date.now()
    const newUser = {
        displayName: 'Usuario Prueba E2E',
        email: `test_${timestamp}@email.com`,
        password: 'password123'
    }

    beforeEach(() => {
        // Interceptar llamadas a la API para depuración
        cy.intercept('POST', '**/api/auth/register').as('registerRequest')
        cy.visit('/register')
    })

    it('Debe mostrar errores si las contraseñas no coinciden', () => {
        cy.get('.register-form #displayName').type(newUser.displayName)
        cy.get('.register-form #email').type(newUser.email)
        cy.get('.register-form #password').type(newUser.password)
        cy.get('.register-form #confirmPassword').type('diferente123')
        cy.get('.register-form button[type="submit"]').click({ force: true })

        cy.get('.error-message').should('be.visible').and('contain', 'Las contraseñas no coinciden')
    })

    it('Debe registrar un nuevo usuario exitosamente y redirigir al login', () => {
        cy.get('.register-form #displayName').type(newUser.displayName)
        cy.get('.register-form #email').type(newUser.email)
        cy.get('.register-form #password').type(newUser.password)
        cy.get('.register-form #confirmPassword').type(newUser.password)
        cy.get('.register-form button[type="submit"]').click({ force: true })

        // Esperar a la respuesta de la API
        cy.wait('@registerRequest').then((interception) => {
            expect(interception.response.statusCode).to.be.oneOf([201, 200])
        })

        // Debe redirigir al login
        cy.url().should('include', '/login')
    })

    it('Debe fallar si el email ya existe', () => {
        cy.get('.register-form #displayName').type('Otro Nombre')
        cy.get('.register-form #email').type(newUser.email)
        cy.get('.register-form #password').type('password123')
        cy.get('.register-form #confirmPassword').type('password123')
        cy.get('.register-form button[type="submit"]').click({ force: true })

        cy.wait('@registerRequest')
        cy.get('.error-message', { timeout: 10000 }).should('be.visible')
            .and('contain', 'User already exists')
    })
})
