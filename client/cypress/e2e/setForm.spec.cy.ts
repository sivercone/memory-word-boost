import datus from '../support/datus';

describe('set form functionality', () => {
  beforeEach(() => {
    cy.login(datus.email, datus.password);
    cy.visit('/sets/new');
  });

  it('creates study set successfully', () => {
    cy.get('[data-testid="input.name"]').type(datus.setName);
    cy.get('[data-testid="input.description"]').type(datus.setDescription);
    cy.get('[data-testid="button.submit"]').click();
    cy.url().should('match', /\/sets\//);
    cy.get('[data-testid="text.name"]').contains(datus.setName);
    cy.get('[data-testid="text.description"]').contains(datus.setDescription);
  });
});
