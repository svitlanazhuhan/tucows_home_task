import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect(page.getByText('No trade-offs • No limits')).toBeVisible();
});

