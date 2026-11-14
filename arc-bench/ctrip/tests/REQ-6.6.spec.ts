// requirement: REQ-6.6
import { test, field, button, region, visible, textVisible, openHome, openSecurity, SMS_CODE } from "./helpers";

test('REQ-6.6: Advance after current-email verification', async ({ page }) => {
  await openHome(page);
  await openSecurity(page, 'email_binding');
  await button(region(page, 'Bound email'), 'Change').click();
  await textVisible(page, 'c***@example.com');
  await button(page, 'Send verification code').click();
  await field(page, 'Verification code').fill(SMS_CODE);
  await button(page, 'Next, verify new email').click();
  await visible(field(page, 'New email'));
});
