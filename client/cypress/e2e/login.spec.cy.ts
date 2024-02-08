import datus from '../support/datus';

describe('login functionality', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login');
  });

  it('requires email and password', () => {
    cy.get('[data-testid="button.submit"]').click();
    cy.get('[data-testid="input.email"]').should('be.focused');
    cy.get('[data-testid="input.email"]').type(datus.email);
    cy.get('[data-testid="button.submit"]').click();
    cy.get('[data-testid="input.password"]').should('be.focused');
  });

  it('allows a user to log in successfully', () => {
    cy.login(datus.email, datus.password);
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
