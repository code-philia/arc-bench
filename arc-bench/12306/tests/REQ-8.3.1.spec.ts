// requirement: REQ-8.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, region, row, home, login, center, orders, orderSetup, search, booking, confirmation } from './helpers';

test("REQ-8.3.1: Open booking confirmation state", async ({ page }) => {
  await entry(page);
  await confirmation(page, 'booking_submit_user');
  const dialog = page.getByRole('dialog', { name: 'Please confirm the following information.', exact: true });
  await expect(dialog).toContainText('G1001');
  await expect(dialog).toContainText('Passenger Example');
  await expect(button(dialog, 'Confirm')).toBeVisible();
  await expect(button(dialog, 'Edit')).toBeVisible();
});
