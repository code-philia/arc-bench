// requirement: REQ-8.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, region, row, home, login, center, orders, orderSetup, search, booking, confirmation } from './helpers';

test("REQ-8.2.1: Open selected-journey booking form", async ({ page }) => {
  await entry(page);
  await booking(page, 'bookable_user');
  await expect(region(page, 'Train Information')).toContainText('G1001');
  await expect(button(page, 'Place order')).toBeVisible();
});
