import { test, expect, type Page } from '@playwright/test';

function getLoginElements(page: Page) {
  return {
    inputEmail: page.getByTestId('input-email'),
    inputPassword: page.getByTestId('input-password'),
    buttonSubmit: page.getByTestId('button-submit'),
  };
}

test.describe('Login functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Log in or Sign up')).toBeInViewport();
  });

  test('should require email and password', async ({ page }) => {
    const { buttonSubmit, inputEmail, inputPassword } = getLoginElements(page);

    await buttonSubmit.click();
    await expect(inputEmail).toBeFocused();
    await inputEmail.fill('dummy@sivercone.com');
    await buttonSubmit.click();
    await expect(inputPassword).toBeFocused();
  });

  test('should allow a user to log in successfully', async ({ page }) => {
    const { buttonSubmit, inputEmail, inputPassword } = getLoginElements(page);

    await inputEmail.fill('dummy@sivercone.com');
    await inputPassword.fill('1234');
    await buttonSubmit.click();

    await expect(page).toHaveURL(/\/$/);
  });
});
