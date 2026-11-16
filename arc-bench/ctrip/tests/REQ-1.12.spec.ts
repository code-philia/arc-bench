// requirement: REQ-1.12
import { test, setChecked, field, button, action, checkbox, visible, heading, openHome, registerToPassword, newMobile, textVisible, loginSubmit, passwordField } from "./helpers";

test('REQ-1.12: Accept an eight-character mixed registration password', async ({ page }) => {
  await openHome(page);
  const phone = newMobile();
  await registerToPassword(page, phone);
  await passwordField(page).fill('Abcd1234');
  await field(page, 'Confirm password').fill('Abcd1234');
  await button(page, 'Complete registration').click();
  await textVisible(page, 'Registration successful');
  await heading(page, 'Log in');
  await field(page, 'Account').fill(phone);
  await passwordField(page).fill('Abcd1234');
  await setChecked(checkbox(page, 'Agree to terms'));
  await loginSubmit(page).click();
  await visible(action(page, 'My account'));
});
