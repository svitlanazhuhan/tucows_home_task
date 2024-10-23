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
    const asinCode = await page.locator("//tr/th[text()=' ASIN ']/following-sibling::td").textContent();
    if (asinCode) {
      await searchForProduct(page, asinCode)
    } else {
      console.log('ASIN code not found.');
    }
    await expect(page.locator('body')).toContainText(
      'Keurig K-Express Single Serve K-Cup Pod Coffee Maker, Mint, With A Removable Reservoir And Strong Button Function'
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