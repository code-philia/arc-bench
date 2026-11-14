// requirement: REQ-1.2
import { test, field, action, visible, heading, openHome, openLogin, passwordField } from "./helpers";

test('REQ-1.2: Open password login', async ({ page }) => {
  await openHome(page);
  await openLogin(page);
  await heading(page, 'Log in');
  await visible(field(page, 'Account'));
  await visible(passwordField(page));
});

test('REQ-1.2: Switch login modes', async ({ page }) => {
  await openHome(page);
  await openLogin(page);
  await action(page, 'Verification code login').click();
  await visible(field(page, 'Mobile number'));
  await visible(field(page, 'Verification code'));
  await action(page, 'Password login').click();
  await visible(field(page, 'Account'));
  await visible(passwordField(page));
});
