// requirement: REQ-3.1.1
import { expect } from '@playwright/test';
import { test, travelDate } from './fixtures/test';
import { button, chooseDepartureDate, entry, field, home, tab } from './helpers';

test("REQ-3.1.1: Open public station and date selectors", async ({ page }) => {
  await entry(page);
  await field(page, 'From').click();
  for (const name of ['Popular', 'ABCDE']) await expect(tab(page, name)).toBeVisible();
  await home(page);
  await chooseDepartureDate(page, travelDate(page));
  await expect(button(page, 'Search')).toBeVisible();
});
