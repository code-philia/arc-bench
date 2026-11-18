// requirement: REQ-1.6
import { test, expect } from '@playwright/test';
import { home, nav, action, cartRow, CART } from './helpers';

test("REQ-1.6: Inspect empty cart", async ({ page }) => {
  await home(page); await action(nav(page), 'Cart').click();
  await expect(page.getByRole('heading', { name: 'Shopping cart', exact: true })).toBeVisible();
  await expect(page.getByText(/(?:cart is empty|no items in your cart)/i)).toBeVisible();
  await expect(cartRow(page, CART)).toHaveCount(0);
});
