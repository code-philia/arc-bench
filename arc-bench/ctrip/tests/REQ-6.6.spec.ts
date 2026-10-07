// requirement: REQ-6.6
import { test, expect } from "@playwright/test";
import { field, button, region, visible, textVisible, openHome, installClock, openSecurity } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-6.6: Advance after current-email verification', async ({ page }, testInfo) => {
  await openHome(page);
  await openSecurity(page, 'email_binding');
  await button(region(page, 'Bound email'), 'Change').click();
  await textVisible(page, 'c***@example.com');
  await button(page, 'Send verification code').click();
  await field(page, 'Verification code').fill('123456');
  await button(page, 'Next, verify new email').click();
  await visible(field(page, 'New email'));
});

