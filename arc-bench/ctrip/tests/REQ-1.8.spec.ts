// requirement: REQ-1.8
import { test, expect } from "@playwright/test";
import { action, openHome, installClock, loginOwner, signedOut } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-1.8: Log out and retain signed-out state', async ({ page }, testInfo) => {
  await openHome(page);
  await loginOwner(page, 'user');
  await action(page, 'My account').hover();
  await page.getByRole('menuitem', { name: 'Log out', exact: true }).click();
  await signedOut(page);
  await page.reload();
  await signedOut(page);
});

