// requirement: REQ-2.7
import { test, expect } from '@playwright/test';
import { home, region, card, count, men, choice, setChoice } from './helpers';

test("REQ-2.7: Filter product size", async ({ page }) => {
  await home(page); await men(page);
  const before = await count(page).innerText();
  const filter = choice(region(page, 'Filters'), 'checkbox', 'M');
  await setChoice(filter); await expect(filter).toBeChecked();
  await expect(card(page, 'White t-shirt')).toBeVisible();
  await expect(card(page, 'Black mug')).toHaveCount(0);
  await expect(count(page)).not.toHaveText(before);
});
