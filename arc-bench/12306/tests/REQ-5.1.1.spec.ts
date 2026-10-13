// requirement: REQ-5.1.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, region, row, home, login, center, orders, orderSetup, search, booking, confirmation } from './helpers';

test("REQ-5.1.1: Open authenticated personal center", async ({ page }) => {
  await entry(page);
  await login(page, 'personal_center_user');
  await center(page);
  await expect(page.getByRole('navigation', { name: 'Personal center menu', exact: true })).toBeVisible();
  await expect(region(page, 'Notice')).toContainText('personal_center_user');
});
