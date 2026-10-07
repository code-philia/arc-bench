// requirement: REQ-1.10
import { test, expect } from "@playwright/test";
import { field, button, action, heading, alertText, openHome, installClock, registrationPhone, registerToPassword } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-1.10: Reject a letters-only registration password', async ({ page }, testInfo) => {
  await openHome(page);
  await registerToPassword(page, registrationPhone(testInfo));
  await field(page, 'Password').fill('abcdefgh');
  await field(page, 'Confirm password').fill('abcdefgh');
  await button(page, 'Complete registration').click();
  await alertText(page, 'Password must contain letters and numbers and be at least 8 characters');
  await heading(page, 'Set password');
  await expect(action(page, 'My account')).toHaveCount(0);
});
