describe('Checkout Flow - Happy Path', () => {
    beforeEach(() => {
        // Limpiar localStorage y cookies antes de cada test
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.visit('/');
    });

    it('Debe permitir a un usuario loguearse, agregar un producto y completar el checkout', () => {
        // 1. Ir a Login (accedemos directamente)
        cy.visit('/login');

        // 2. Hacer login (usando datos reales o mock si el backend está en test mode)
        cy.get('#email').type('cliente@email.com');
        cy.get('#password').type('cliente123');
        cy.get('.login-form button[type="submit"]').click();

        // 3. Volver a home y buscar un producto
        cy.visit('/');
        cy.get('[data-testid="add-to-cart-btn"]').first().click();

        // 4. Ir al carrito
        cy.get('a[href="/cart"]').first().click();
        cy.contains('Finalizar compra').click();

        // 5. En Checkout - Confirmar Pago
        // Nota: Asumimos que ya hay una dirección y pago por defecto del usuario 'browser@test.com'
        cy.get('[data-testid="confirm-payment-btn"]').should('not.be.disabled').click();

        // 6. Verificación final
        cy.url().should('include', '/order-confirmation');
        cy.contains('¡Compra realizada con éxito!').should('be.visible');
    });
});
