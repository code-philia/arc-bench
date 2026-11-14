// requirement: REQ-8.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, confirmation, confirmationDialog, entry } from './helpers';
import { bookingAccounts } from './fixtures/data';

test("REQ-8.3.1: Open booking confirmation state", async ({ page }) => {
  await entry(page);
  const journey = await confirmation(page, bookingAccounts.submit);
  const dialog = confirmationDialog(page);
  await expect(dialog).toContainText(journey.train);
  await expect(dialog).toContainText(journey.passenger.name);
  await expect(button(dialog, 'Confirm')).toBeVisible();
  await expect(button(dialog, 'Edit')).toBeVisible();
});
