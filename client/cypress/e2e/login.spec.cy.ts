describe('login functionality', () => {
  beforeEach(() => cy.visit('/login'));
  it('allows a user to log in successfully', () => {
    const mockValues = { email: 'user@example.com', password: '.password0123' };
    cy.get('[data-testid="input.email"]').type(mockValues.email);
    cy.get('[data-testid="input.password"]').type(mockValues.password);
    cy.get('[data-testid="button.submit"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
