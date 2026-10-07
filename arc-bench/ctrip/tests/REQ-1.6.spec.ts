// requirement: REQ-1.6
import { test, expect } from "@playwright/test";
import { field, visible, heading, openHome, installClock, registrationPhone, registerToPassword } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-1.6: Advance after mobile verification', async ({ page }, testInfo) => {
  await openHome(page);
  await registerToPassword(page, registrationPhone(testInfo));
  await heading(page, 'Set password');
  await visible(field(page, 'Password'));
  await visible(field(page, 'Confirm password'));
});

