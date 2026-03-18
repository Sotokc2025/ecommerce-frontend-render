describe('Address Management Flow', () => {
    beforeEach(() => {
        cy.loginByApi(); // Login rápido vía API
        // Asegurar que hay productos en el carrito antes de ir a checkout
        cy.visit('/');
        // Esperar a que los productos carguen y agregar uno al carrito
        cy.get('[data-testid="add-to-cart-btn"]', { timeout: 15000 }).should('be.visible').first().click();
        cy.wait(500); // Breve espera para que se agregue al carrito
        cy.visit('/checkout'); // Ir a la página de checkout
    });

    it('Debe permitir agregar una nueva dirección y seleccionarla', () => {
        // Abrir sección de direcciones si no está abierta
        cy.contains('1. Dirección de envío').click();
        cy.contains('Nueva dirección').click();

        cy.get('input[name="name"]').type('Oficina Central');
        cy.get('input[name="address1"]').type('Av. Siempre Viva 742');
        cy.get('input[name="city"]').type('Springfield');
        cy.get('input[name="postalCode"]').type('12345');

        cy.get('button').contains('Guardar').click();

        cy.contains('Oficina Central').should('be.visible');
        cy.contains('Dirección guardada correctamente').should('be.visible');
    });

    it('Debe permitir eliminar una dirección existente', () => {
        cy.contains('1. Dirección de envío').click();
        // Buscar la dirección 'Oficina Central' y darle a eliminar
        cy.contains('Oficina Central').parent().find('button').contains('Eliminar').click();
        cy.contains('Oficina Central').should('not.exist');
    });
});
