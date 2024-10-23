import { Page } from "@playwright/test";

export async function searchForProduct(page: Page, searchQuery: string) {
  // Define your search bar's locator here
  const searchField = page.getByPlaceholder('Search Amazon.ca')
  // Fill the search bar with your `searchQuery`
  await searchField.fill(searchQuery.trim());
  // Submit your search ("Enter" or clicking the search button)
  await searchField.press('Enter');
}