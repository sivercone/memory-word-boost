import { test, expect } from '@playwright/test';

import { loginAsGuest } from '@tests/utils';

test.beforeEach(async ({ page }) => {
  await loginAsGuest(page);
});

test('should be able to reach and edit user details', async ({ page }) => {
  await page.getByTestId('dropdown-menu').click();
  await page.getByTestId('dropdown-menu-profile').click();

  await expect(page).toHaveURL(/\/user\/[^/]+$/);

  await page.getByTestId('button-edit').click();

  await expect(page.getByTestId('dialog-user-form')).toBeInViewport();
  await page.getByRole('textbox', { name: 'Name' }).fill('Danylo Trofimenko');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByTestId('dialog-user-form')).not.toBeInViewport();
  await expect(page.getByText('Danylo Trofimenko')).toBeInViewport();
});
