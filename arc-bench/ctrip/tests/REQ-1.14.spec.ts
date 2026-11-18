// requirement: REQ-1.14
import { expect } from "@playwright/test";
import { test, field, action, heading, submitInvalidRegistrationPassword, openHome, registerToPassword, newMobile, passwordField } from "./helpers";

test('REQ-1.14: Reject a short mixed registration password', async ({ page }) => {
  await openHome(page);
  await registerToPassword(page, newMobile());
  await passwordField(page).fill('Abcd123');
  await field(page, 'Confirm password').fill('Abcd123');
  await submitInvalidRegistrationPassword(page);
  await heading(page, 'Set password');
  await expect(action(page, 'My account')).toHaveCount(0);
});
