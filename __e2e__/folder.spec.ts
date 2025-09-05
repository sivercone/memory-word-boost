import { test, expect } from '@playwright/test';

import { loginAsGuest } from '@__e2e__/utils';

test.beforeEach(async ({ page }) => {
  await loginAsGuest(page);
});

test('should create a new folder', async ({ page }) => {
  await page.getByTestId('dropdown-create').click();
  await page.getByTestId('dropdown-create-folder').click();

  const folderName = `Ukrainian Vocabulary ${test.info().parallelIndex}-${Date.now()}`;
  await expect(page.getByTestId('dialog-folder-form')).toBeVisible();
  await page.getByRole('textbox', { name: 'Name' }).fill(folderName);
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByTestId('dialog-folder-form')).toBeHidden();

  await expect(page.getByText(folderName)).toBeVisible();

  await page.goto('/');

  await expect(page.getByText(folderName)).toBeVisible();
});
