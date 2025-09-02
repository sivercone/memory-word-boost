import { expect, type Page } from '@playwright/test';

export async function loginAsGuest(page: Page) {
  await page.goto('/login');
  await page.getByTestId('button-continue-as-guest').click();
  await expect(page).toHaveURL(/\/$/);
}
