// @ts-check
Cypress.Commands.add('loginByApi', (email = 'browser@test.com', password = 'Password123') => {
    cy.request('POST', 'http://localhost:3000/api/auth/login', {
        email,
        password,
    }).then((response) => {
        window.localStorage.setItem('user', JSON.stringify(response.body.user));
        window.localStorage.setItem('token', response.body.token);
    });
});

Cypress.Commands.add('addProductToCart', (productId) => {
    // Lógica para agregar al carrito vía localStorage o dispatch si es necesario
    // Por ahora lo haremos vía UI en los tests para mayor realismo
});
