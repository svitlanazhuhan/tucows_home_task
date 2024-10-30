import { test, expect } from '@playwright/test';
import { searchForProduct } from './utils';

test.describe('Amazon tests', () => {

  test.beforeEach(async ({ page, context }) => {
    await page.goto('https://a.co/d/bFF9Yx5');
  })

  test('has title', async ({ page }) => {
    await expect(page.getByTestId('title')).toContainText('Keurig K-Express Single Serve K-Cup Pod Coffee Maker');
  });

  test('search for a product', async ({ page }) => {
    const asinLocator = await page.locator("//tr/th[text()=' ASIN ']/following-sibling::td");
    const asinNumber = await asinLocator.innerText();
    const cleanedAsinNumber = asinNumber.trim(); 
    await searchForProduct(page, cleanedAsinNumber);
    
    await expect(page.locator('s-search-results')).toContainText(
      'Starbucks Single-Origin Colombia Coffee'
    );
  })

  test('add product to card', async ({ page }) => {
    await page.getByTestId('add-to-cart-button').click();
    const cardItemsCount = await page.getByTestId('nav-cart-count-container').innerText();
    expect(cardItemsCount).not.toBeNull();
    expect(cardItemsCount.trim()).toBe('1');
    await page.getByRole('link', { name: 'Go to cart' }).click()
    const qtySelectValue = await page.locator('select[name="quantity"]').inputValue();
    expect(qtySelectValue.trim()).toBe('1');
    await page.getByRole('button', { name: ' Proceed to Checkout ' }).click()
    await expect(page).toHaveURL(/.*signin.*/);
  })
});