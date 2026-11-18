// requirement: REQ-4.3
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, cartSetup, CART } from './helpers';

test("REQ-4.3: Return to browsing", async ({ page }) => {
  await home(page); await cartSetup(page, CART); await action(page, 'Continue shopping').click();
  await expect(page.getByRole('heading', { name: 'Men', exact: true })).toBeVisible(); await expect(card(page, CART)).toBeVisible();
  await expect(action(nav(page), 'Cart')).toContainText('1');
});

test("REQ-4.3: Enter checkout with selected cart", async ({ page }) => {
  await home(page); await cartSetup(page, CART); await action(page, 'Proceed to checkout').click();
  await expect(region(page, 'Personal Information')).toBeVisible(); await expect(region(page, 'Order summary')).toContainText(CART);
});
