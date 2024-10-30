import { test, expect } from '@playwright/test';
import { searchForProduct } from './utils';

test('Search for gift card on Amazon and apply Netflix filter', async ({ page }) => {
  await page.goto('https://www.amazon.ca');

  await searchForProduct(page, 'gift card');

  await page.waitForSelector('.s-main-slot');

  const resultsSummaryText = await page.innerText('.s-desktop-toolbar');

  const totalResultsMatch = resultsSummaryText.match(/([\d,]+) results/);
  const totalResults = totalResultsMatch ? parseInt(totalResultsMatch[1].replace(/,/g, ''), 10) : 0;

  console.log(`Number of results before filtering: ${totalResults}`);

  await page.getByLabel('Birthday').getByRole('link', { name: 'Birthday' }).click();
  await page.waitForTimeout(2000);

  const filteredResultsSummaryText = await page.innerText('.s-desktop-toolbar');
  const filteredResultsMatch = filteredResultsSummaryText.match(/([\d,]+) results/);
  const filteredResults = filteredResultsMatch ? parseInt(filteredResultsMatch[1].replace(/,/g, ''), 10) : 0;
  console.log(`Number of results after filtering: ${filteredResultsMatch}`);
  expect(filteredResults).toBeLessThan(totalResults);
  await page.locator('a:has-text("Amazon.ca eGift Card (Instant Email or Text Delivery)")').first().click();
  await page.getByRole('button', { name: '$75' }).click();
  await page.getByPlaceholder('Recipient e-mail').fill('test@test.com');
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await expect(page.getByText('Cart Subtotal: $75.00')).toBeVisible();
});