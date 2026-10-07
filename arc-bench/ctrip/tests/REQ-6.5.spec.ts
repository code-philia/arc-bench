// requirement: REQ-6.5
import { test, expect } from "@playwright/test";
import { field, button, region, visible, heading, textVisible, openHome, installClock, openSecurity } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-6.5: Advance to new-phone verification', async ({ page }, testInfo) => {
  await openHome(page);
  await openSecurity(page, 'phone_binding');
  await button(region(page, 'Bound phone'), 'Change').click();
  await heading(page, 'Verify identity');
  await field(page, 'Login password').fill('Travel1234');
  await field(page, 'New phone').fill('13900000018');
  await button(page, 'Next, verify new phone').click();
  await heading(page, 'Verify new phone');
  await visible(field(page, 'Verification code'));
  await textVisible(page, 'Code sent to 13900000018');
});

