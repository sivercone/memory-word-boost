export async function loginAsGuest(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.click('[data-testid="button-continue-as-guest"]');
}
