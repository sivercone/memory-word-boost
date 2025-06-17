import { test, expect } from '@playwright/test';

import { loginAsGuest } from '@tests/utils';

test.beforeEach(async ({ page }) => {
  await loginAsGuest(page);
});

test('should create a new folder', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('dropdown-create').click();
  await page.getByTestId('dropdown-create-folder').click();

  await expect(page.getByTestId('dialog-folder-form')).toBeInViewport();
  await page.getByRole('textbox', { name: 'Name' }).fill('Ukrainian Vocabulary');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('dialog-user-form')).not.toBeInViewport();

  await expect(page.getByText('Ukrainian Vocabulary')).toBeInViewport();

  await page.goto('/');

  await expect(page.getByText('Ukrainian Vocabulary')).toBeInViewport();
});
