// requirement: REQ-1.6
import { test, expect } from '@playwright/test';
import { home, nav, action, cartHeading, cartRow, emptyCartMessage, CART } from './helpers';

test("REQ-1.6: Inspect empty cart", async ({ page }) => {
  await home(page); await action(nav(page), 'Cart').click();
  await expect(cartHeading(page)).toBeVisible();
  await expect(emptyCartMessage(page)).toBeVisible();
  await expect(cartRow(page, CART)).toHaveCount(0);
});
