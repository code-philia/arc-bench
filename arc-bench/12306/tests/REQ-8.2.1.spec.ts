// requirement: REQ-8.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { booking, button, entry, region } from './helpers';
import { bookingAccounts } from './fixtures/data';

test("REQ-8.2.1: Open selected-journey booking form", async ({ page }) => {
  await entry(page);
  const journey = await booking(page, bookingAccounts.inspect);
  await expect(region(page, 'Train Information')).toContainText(journey.train);
  await expect(button(page, 'Place order')).toBeVisible();
});
