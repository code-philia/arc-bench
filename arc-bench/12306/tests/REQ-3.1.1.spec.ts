// requirement: REQ-3.1.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, region, row, home, login, center, orders, orderSetup, search, booking, confirmation } from './helpers';

test("REQ-3.1.1: Open public station and date selectors", async ({ page }) => {
  await entry(page);
  await page.getByPlaceholder('From', { exact: true }).click();
  for (const name of ['Popular', 'ABCDE']) await expect(page.getByRole('tab', { name, exact: true })).toBeVisible();
  await home(page);
  await field(page, 'Date').click();
  await expect(button(page, '2026-07-21')).toBeVisible();
  await expect(button(page, 'Search')).toBeVisible();
});
