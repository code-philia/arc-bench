// requirement: REQ-6.4
import { test, expect } from '@playwright/test';
import { home, nav, action, region, loginCustomer, account, DETAIL } from './helpers';

test("REQ-6.4: Sign out from account", async ({ page }) => {
  await home(page);
  await loginCustomer(page);
  await account(page);
  await action(nav(page), 'Sign out').click();
  await expect(action(nav(page), 'Sign in')).toBeVisible();
  await expect(action(nav(page), 'Cart')).toBeVisible();
  await expect(action(nav(page), 'Sign out')).toHaveCount(0);
  await expect(action(region(page, 'Popular Products'), DETAIL, true)).toBeVisible();
});
