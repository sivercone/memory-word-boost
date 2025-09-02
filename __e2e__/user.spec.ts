import { test, expect } from '@playwright/test';

import { loginAsGuest } from '@__e2e__/utils';

test.beforeEach(async ({ page }) => {
  await loginAsGuest(page);
});

test('should be able to reach and edit user details', async ({ page }) => {
  await page.getByTestId('dropdown-menu').click();
  await page.getByTestId('dropdown-menu-profile').click();

  await expect(page).toHaveURL(/\/user\/[^/]+$/);

  await page.getByTestId('button-edit').click();

  const userName = `Alice Lastname ${test.info().parallelIndex}-${Date.now()}`;
  await expect(page.getByTestId('dialog-user-form')).toBeVisible();
  await page.getByRole('textbox', { name: 'Name' }).fill(userName);
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByTestId('dialog-user-form')).toBeHidden();
  await expect(page.getByText(userName)).toBeVisible();
});
