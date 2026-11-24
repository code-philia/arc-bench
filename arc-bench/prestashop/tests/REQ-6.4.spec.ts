// requirement: REQ-6.4
import { test, expect } from '@playwright/test';
import { home, nav, signedInNav, expectSignedOutNav, action, region, loginExisting, account, DETAIL } from './helpers';

test("REQ-6.4: Sign out from account", async ({ page }) => {
  await home(page);
  await loginExisting(page, 'user');
  await account(page);
  await action(await signedInNav(page), 'Sign out').click();
  await expect(action(nav(page), 'Sign in')).toBeVisible();
  await expect(action(nav(page), 'Cart')).toBeVisible();
  await expect(action(nav(page), 'Sign out')).toHaveCount(0);
  await expectSignedOutNav(page);
  await expect(action(region(page, 'Popular Products'), DETAIL, true)).toBeVisible();
});
