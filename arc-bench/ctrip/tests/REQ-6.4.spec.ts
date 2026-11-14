// requirement: REQ-6.4
import { test, setChecked, field, button, action, region, checkbox, visible, textVisible, alertText, openHome, openLogin, openSecurity, passwordInput, registerAccount, loginSubmit, passwordField } from "./helpers";

test('REQ-6.4: Replace password and require reauthentication', async ({ page }) => {
  await openHome(page);
  const account = await registerAccount(page);
  const newPassword = passwordInput();
  await openSecurity(page);
  await button(region(page, 'Login password'), 'Change').click();
  await field(page, 'Current password').fill(account.password);
  await field(page, 'New password').fill(newPassword);
  await field(page, 'Confirm new password').fill(newPassword);
  await textVisible(region(page, 'Password strength'), 'Strong');
  await button(page, 'Complete').click();
  await textVisible(page, 'Sign in again');
  await openHome(page);
  await openLogin(page);
  await field(page, 'Account').fill(account.mobile);
  await passwordField(page).fill(account.password);
  await setChecked(checkbox(page, 'Agree to terms'));
  await loginSubmit(page).click();
  await alertText(page, 'Incorrect account or password');
  await passwordField(page).fill(newPassword);
  await loginSubmit(page).click();
  await visible(action(page, 'My account'));
});
