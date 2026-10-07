// requirement: REQ-1.12
import { test, expect } from "@playwright/test";
import { field, button, action, checkbox, visible, heading, openHome, installClock, registrationPhone, registerToPassword } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-1.12: Accept an eight-character mixed registration password', async ({ page }, testInfo) => {
  await openHome(page);
  const phone = registrationPhone(testInfo);
  await registerToPassword(page, phone);
  await field(page, 'Password').fill('Abcd1234');
  await field(page, 'Confirm password').fill('Abcd1234');
  await button(page, 'Complete registration').click();
  await visible(page.getByRole('status').filter({ hasText: 'Registration successful' }));
  await heading(page, 'Log in');
  await field(page, 'Account').fill(phone);
  await field(page, 'Password').fill('Abcd1234');
  await checkbox(page, 'Agree to terms').check();
  await button(page, 'Log in').click();
  await visible(action(page, 'My account'));
});
