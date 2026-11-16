// requirement: REQ-1.6
import { test, field, visible, heading, openHome, registerToPassword, newMobile, passwordField } from "./helpers";

test('REQ-1.6: Advance after mobile verification', async ({ page }) => {
  await openHome(page);
  await registerToPassword(page, newMobile());
  await heading(page, 'Set password');
  await visible(passwordField(page));
  await visible(field(page, 'Confirm password'));
});
