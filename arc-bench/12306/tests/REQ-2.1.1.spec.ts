// requirement: REQ-2.1.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, region, row, home, login, center, orders, orderSetup, search, booking, confirmation } from './helpers';

test("REQ-2.1.1: Open traveler registration", async ({ page }) => {
  await entry(page);
  await link(page, 'Register').click();
  for (const name of ['Nationality', 'Name', 'Passport number', 'Password', 'Confirm Password']) await expect(field(page, name)).toBeVisible();
  await expect(button(page, 'Register')).toBeVisible();
});
