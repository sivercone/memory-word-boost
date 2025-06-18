import { expect, test } from '@playwright/test';

import { loginAsGuest } from '@tests/utils';

test.beforeEach(async ({ page }) => {
  await loginAsGuest(page);
});

test('should create a new study set', async ({ page }) => {
  await page.getByTestId('dropdown-create').click();
  await page.getByTestId('dropdown-create-set').click();

  await expect(page).toHaveURL('/sets/new');

  await page.getByRole('button', { name: 'Cards' }).click();

  await page.getByRole('button', { name: 'Add Card' }).click();
  await page.getByRole('textbox', { name: 'Front' }).fill('Front card text');
  await page.getByRole('textbox', { name: 'Back' }).fill('Back card text');

  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Study Set Experiment');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Study Set Experiment')).toBeInViewport();
  await expect(page.getByText('Front card text')).toBeInViewport();
  await expect(page.getByText('Back card text')).toBeInViewport();
});
