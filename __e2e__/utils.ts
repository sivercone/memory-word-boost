import { expect, type Page } from '@playwright/test';

export async function loginAsGuest(page: Page) {
  await page.goto('/login');
  await page.click('[data-testid="button-continue-as-guest"]');
  await expect(page).toHaveURL('/');
}
