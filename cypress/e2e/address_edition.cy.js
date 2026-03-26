// @ts-check
describe('Flujo de Direcciones - Edición', () => {
    const timestamp = Date.now()
    const user = {
        displayName: 'Erick Ruiz Test',
        email: `erick_${timestamp}@test.com`,
        password: 'password123'
    }

    const address = {
        name: 'Casa Erick',
        address1: 'Av. La Querencia 304',
        address2: 'Casa 20',
        city: 'Aguascalientes',
        state: 'Aguascalientes',
        postalCode: '20329',
        phone: '55-5566-7788'
    }

    before(() => {
        // 1. Registrar usuario
        cy.visit('/register')
        cy.get('.register-form #displayName').type(user.displayName)
        cy.get('.register-form #email').type(user.email)
        cy.get('.register-form #password').type(user.password)
        cy.get('.register-form #confirmPassword').type(user.password)
        cy.get('.register-form button[type="submit"]').click()

        // 2. Login
        cy.url().should('include', '/login')
        cy.get('.login-card #email').type(user.email)
        cy.get('.login-card #password').type(user.password)
        cy.get('.login-card button[type="submit"]').click()

        // Al loguearse debe ir a Home. Agregamos un item para ir al checkout
        cy.url().should('not.include', '/login')
        cy.visit('/')
        cy.get('.product-card', { timeout: 10000 }).should('be.visible')
        cy.get('.product-card').first().find('button', { timeout: 10000 }).contains('Añadir').click()

        // Abrir el carrito y proceder al checkout
        cy.get('.cart-btn').first().click()
        cy.contains('Comprar maderas').click()
        cy.url().should('include', '/checkout')
    })

    it('Debe precargar correctamente los campos al editar una dirección', () => {
        // 3. Agregar dirección inicial
        cy.contains('Nueva Dirección').click()
        cy.get('input[name="name"]').type(address.name)
        cy.get('input[name="address1"]').type(address.address1)
        cy.get('input[name="address2"]').type(address.address2)
        cy.get('input[name="postalCode"]').type(address.postalCode)
        cy.get('input[name="city"]').type(address.city)
        cy.get('input[name="state"]').type(address.state)
        cy.get('input[name="phone"]').type(address.phone)
        cy.get('button[type="submit"]').contains('Agregar Dirección').click()

        cy.contains('Dirección guardada correctamente').should('be.visible')

        // 4. Expandir sección para ver la lista y poder editar
        cy.contains('1. Dirección de envío').parents('.summary-section').contains('Cambiar').click()

        // 5. Hacer clic en Editar
        cy.get('.address-item', { timeout: 10000 }).should('be.visible')
        cy.get('.address-item').contains(address.name).parents('.address-item').contains('Editar').click()

        // 6. VERIFICACIÓN CRÍTICA: Los campos no deben estar vacíos
        // Esperar un poco a que el useEffect rellene los campos
        cy.get('input[name="address1"]', { timeout: 10000 }).should('have.value', address.address1)
        cy.get('input[name="address2"]').should('have.value', address.address2)
        cy.get('input[name="city"]').should('have.value', address.city)

        // 7. Realizar un cambio
        cy.get('input[name="address1"]').clear().type('Nueva Avenida 456')
        cy.get('button[type="submit"]').contains('Guardar Cambios').click()

        cy.contains('Dirección guardada correctamente').should('be.visible')

        // Expandir de nuevo para verificar el cambio persistido
        cy.contains('1. Dirección de envío').parents('.summary-section').contains('Cambiar').click()
        cy.get('.address-item').should('contain', 'Nueva Avenida 456')
    })
})
