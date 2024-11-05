import { test, expect } from '@playwright/test';
import { searchForProduct } from './utils';
import { getSearchResultsNumber } from './utils';

test('Search for gift card on Amazon and apply Netflix filter', async ({ page }) => {
  await page.goto('https://www.amazon.ca');
  await searchForProduct(page, 'gift card');
  await page.waitForSelector('.s-main-slot');

  const totalResults = await getSearchResultsNumber(page);
  console.log(`Number of results before filtering: ${totalResults}`);
  await page.getByLabel('Birthday').getByRole('link', { name: 'Birthday' }).click();

  const filteredResults = await getSearchResultsNumber(page);
  console.log(`Number of results after filtering: ${filteredResults}`);
  expect(filteredResults).toBeLessThan(totalResults);
  await page.getByRole("link", { name: "Amazon.ca eGift Card (Instant Email or Text Delivery)" }).first().click();
  await expect(page.getByTestId('gc-asin-title')).toContainText('Amazon.ca eGift Card');
  await page.getByRole('button', { name: '$75' }).click();
  await expect(page.getByTestId('gc-live-preview-amount')).toContainText('$75.00');
  await page.getByPlaceholder('Recipient e-mail').fill('test@test.com');
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await expect(page.getByText('Cart Subtotal: $75.00')).toBeVisible();
});