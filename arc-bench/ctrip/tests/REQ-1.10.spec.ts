// requirement: REQ-1.10
import { expect } from "@playwright/test";
import { test, field, action, heading, submitInvalidRegistrationPassword, openHome, registerToPassword, newMobile, passwordField } from "./helpers";

test('REQ-1.10: Reject a letters-only registration password', async ({ page }) => {
  await openHome(page);
  await registerToPassword(page, newMobile());
  await passwordField(page).fill('abcdefgh');
  await field(page, 'Confirm password').fill('abcdefgh');
  await submitInvalidRegistrationPassword(page);
  await heading(page, 'Set password');
  await expect(action(page, 'My account')).toHaveCount(0);
});
