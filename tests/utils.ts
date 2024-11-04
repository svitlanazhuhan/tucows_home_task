import { Page } from "@playwright/test";

export async function searchForProduct(page: Page, searchQuery: string) {
  // Define your search bar's locator here
  const searchField = page.getByPlaceholder('Search Amazon.ca')
  // Fill the search bar with your `searchQuery`
  await searchField.fill(searchQuery.trim());
  // Submit your search ("Enter" or clicking the search button)
  await searchField.press('Enter');
}

export async function getSearchResultsNumber(page: Page) {
  const resultsSummaryText = await page.innerText('.s-desktop-toolbar');
  const resultsRegex = /([\d,]+) results/;
  const matches = resultsSummaryText.match(resultsRegex);
  const numberWithCommas = matches ? matches[1] : '0';
  const totalResults = parseInt(numberWithCommas.replace(/,/g, ''), 10);
  return totalResults;
}