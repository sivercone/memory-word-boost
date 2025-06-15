import { test, expect } from '@playwright/test';
import { loginAsGuest } from '@tests/utils';

test.beforeEach(async ({ page }) => {
  await loginAsGuest(page);
});

test('should clear auth data and redirect to login page', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('dropdown-menu').click();
  await page.getByTestId('dropdown-menu-logout').click();

  await page.goto('/');

  await expect(page).toHaveURL(/\/login$/);
});
