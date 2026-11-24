// requirement: REQ-2.4
import { test, expect } from '@playwright/test';
import { home, card, men, listingPrices, WHITE, selectField, chooseOption } from './helpers';

test("REQ-2.4: Sort current prices ascending", async ({ page }) => {
  await home(page); await men(page);
  const sort = selectField(page, 'Sort by');
  await chooseOption(sort, 'Price, low to high');

  await expect(card(page, WHITE)).toBeVisible();
  await expect.poll(async () => { const p = await listingPrices(page); return p.length >= 2 && p.every((v, i) => i === 0 || p[i - 1] <= v); }).toBe(true);
});
