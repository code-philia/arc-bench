// requirement: REQ-1.14
import { expect } from "@playwright/test";
import { test, field, button, action, heading, alertText, openHome, registerToPassword, newMobile, passwordField } from "./helpers";

test('REQ-1.14: Reject a short mixed registration password', async ({ page }) => {
  await openHome(page);
  await registerToPassword(page, newMobile());
  await passwordField(page).fill('Abcd123');
  await field(page, 'Confirm password').fill('Abcd123');
  await button(page, 'Complete registration').click();
  await alertText(page, 'Password must contain letters and numbers and be at least 8 characters');
  await heading(page, 'Set password');
  await expect(action(page, 'My account')).toHaveCount(0);
});
