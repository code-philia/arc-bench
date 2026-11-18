// requirement: REQ-1.11
import { expect } from "@playwright/test";
import { test, field, action, heading, submitInvalidRegistrationPassword, openHome, registerToPassword, newMobile, passwordField } from "./helpers";

test('REQ-1.11: Reject a numbers-only registration password', async ({ page }) => {
  await openHome(page);
  await registerToPassword(page, newMobile());
  await passwordField(page).fill('12345678');
  await field(page, 'Confirm password').fill('12345678');
  await submitInvalidRegistrationPassword(page);
  await heading(page, 'Set password');
  await expect(action(page, 'My account')).toHaveCount(0);
});
