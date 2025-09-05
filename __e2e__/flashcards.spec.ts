import { expect, test } from '@playwright/test';

import { loginAsGuest } from '@__e2e__/utils';

test.beforeEach(async ({ page }) => {
  await loginAsGuest(page);
});

test('study with flashcards and complete set', async ({ page }) => {
  // Open the default "Sets" folder
  await page.getByRole('link', { name: 'Sets' }).click();

  // Open the first set in the list
  const firstSet = page
    .locator('a[href^="/sets/"]') // ^ means "starts with"
    .first();
  await firstSet.click();

  // Enter Flashcards mode
  await page.getByRole('link', { name: 'Flashcards' }).click();

  // Flip once to back and ensure aria-pressed changes
  const cardButton = page.getByRole('button', { name: /Flashcard\./ });
  await expect(cardButton).toHaveAttribute('aria-pressed', 'false');
  await cardButton.click();
  await expect(cardButton).toHaveAttribute('aria-pressed', 'true');

  // Mark current card as known
  await page.getByRole('button', { name: 'Already Know that' }).click();

  // Finish the remaining cards quickly via keyboard
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press('KeyD');
  }

  // Completion view should appear with stats
  await expect(page.getByText('Well done!')).toBeVisible();
  await expect(page.getByText(/Cards Completed: \d+/)).toBeVisible();
  await expect(page.getByText(/Score: \d+%/)).toBeVisible();

  // Continue button navigates back to set details
  await page.getByRole('link', { name: 'Continue' }).click();
  expect(page.url()).toMatch(/\/sets\//);
});
