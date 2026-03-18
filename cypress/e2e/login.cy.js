describe('Flujo de Autenticación - Login', () => {
    beforeEach(() => {
        // Limpiar estado y visitar login
        cy.visit('/login')
    })

    it('Debe mostrar errores de validación de formato', () => {
        cy.get('#email').type('email-invalido')
        cy.get('#password').type('123')
        cy.get('.login-form button[type="submit"]').click()

        // Cypress/HTML5 nativo validará el formato, pero buscamos feedback en la UI si existe
        cy.get('#email:invalid').should('exist')
    })

    it('Debe mostrar error de API con credenciales incorrectas', () => {
        cy.get('#email').type('no-existe@email.com')
        cy.get('#password').type('passwordIncorrecto')
        cy.get('.login-form button[type="submit"]').click()

        // Esperar respuesta de la API y validar mensaje de error
        cy.get('.error-message', { timeout: 5000 }).should('be.visible')
            .and('not.be.empty')
    })

    it('Debe iniciar sesión exitosamente con usuario de prueba (Cliente)', () => {
        // Usar usuario de prueba documentado en LoginForm.jsx
        cy.get('#email').type('cliente@email.com')
        cy.get('#password').type('cliente123')
        cy.get('.login-form button[type="submit"]').click()

        // Validar redirección al Home
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/')

        // Validar que el Header refleje el estado autenticado
        cy.get('.user-text', { timeout: 10000 }).should('contain', 'Hola,')
    })

    it('Debe permitir cerrar sesión', () => {
        // Login rápido
        cy.get('#email').type('cliente@email.com')
        cy.get('#password').type('cliente123')
        cy.get('.login-form button[type="submit"]').click()

        // Esperar a que se complete la navegación
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/')

        // Abrir menú de usuario
        cy.get('.user-info', { timeout: 10000 }).should('be.visible').click({ force: true })

        // Esperar a que el dropdown sea visible y hacer click en logout
        cy.get('.user-dropdown', { timeout: 5000 }).should('be.visible')
        cy.get('.logout-btn').should('be.visible').click({ force: true })

        // Validar que volvió al estado no autenticado (Cuenta y Listas es el texto original)
        cy.get('.account-text', { timeout: 5000 }).should('contain', 'Cuenta y Listas')
    })
})
