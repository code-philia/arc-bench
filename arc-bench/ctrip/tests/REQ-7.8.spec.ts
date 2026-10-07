// requirement: REQ-7.8
import { test, expect } from "@playwright/test";
import { action, region, textVisible, openHome, installClock, loginOwner, openStatus, queryStatusNumber } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-7.8: Keep status search history private to its account', async ({ page }, testInfo) => {
  await openHome(page);
  await loginOwner(page, 'history_isolation');
  await openStatus(page);
  await queryStatusNumber(page, 'JD5162');
  await openHome(page);
  await action(page, 'My account').hover();
  await page.getByRole('menuitem', { name: 'Log out', exact: true }).click();
  await loginOwner(page, 'profile_read');
  await openStatus(page);
  await expect(action(region(page, 'Search history'), 'JD5162')).toHaveCount(0);
  await textVisible(region(page, 'Search history'), 'No search history');
});
