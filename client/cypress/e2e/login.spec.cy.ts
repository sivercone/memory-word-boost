const mockValues = { email: 'user@example.com', password: '.password0123' };

describe('login functionality', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login');
  });

  it('requires email and password', () => {
    cy.get('[data-testid="button.submit"]').click();
    cy.get('[data-testid="input.email"]').should('be.focused');
    cy.get('[data-testid="input.email"]').type(mockValues.email);
    cy.get('[data-testid="button.submit"]').click();
    cy.get('[data-testid="input.password"]').should('be.focused');
  });

  it('allows a user to log in successfully', () => {
    cy.get('[data-testid="input.email"]').type(mockValues.email);
    cy.get('[data-testid="input.password"]').type(mockValues.password);
    cy.get('[data-testid="button.submit"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
