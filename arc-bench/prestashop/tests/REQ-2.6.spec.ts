// requirement: REQ-2.6
import { test, expect } from '@playwright/test';
import { home, region, card, count, men, choice, setChoice } from './helpers';

test("REQ-2.6: Filter products on sale", async ({ page }) => {
  await home(page); await men(page);
  const before = await count(page).innerText();
  const filter = choice(region(page, 'Filters'), 'checkbox', 'On sale');
  await setChoice(filter); await expect(filter).toBeChecked();
  await expect(card(page, 'Hummingbird detail t-shirt')).toBeVisible();
  await expect(card(page, 'White t-shirt')).toHaveCount(0);
  await expect(count(page)).not.toHaveText(before);
});
