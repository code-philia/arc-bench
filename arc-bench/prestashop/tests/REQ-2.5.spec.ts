// requirement: REQ-2.5
import { test, expect } from '@playwright/test';
import { home, action, count, men, navigation, listingProducts, listingNames } from './helpers';
import { catalog } from './fixtures/data';

test("REQ-2.5: Inspect first page and browse second", async ({ page }) => {
  await home(page);
  await men(page);
  await expect(count(page)).toHaveText(/^Showing\s+1\s*[-\u2013]\s*12\s+of\s+13(?:\s+item\(s\)|\s+items?)?$/i);
  await expect(listingProducts(page)).toHaveCount(12);
  const first = await listingNames(page);
  await action(navigation(page, 'Pagination'), 'Next').click();
  await expect(count(page)).toHaveText(/^Showing\s+13\s*[-\u2013]\s*13\s+of\s+13(?:\s+item\(s\)|\s+items?)?$/i);
  await expect(listingProducts(page)).toHaveCount(1);
  const second = await listingNames(page);
  expect([...first, ...second].sort()).toEqual(catalog.map(([name]) => name).sort());
});
