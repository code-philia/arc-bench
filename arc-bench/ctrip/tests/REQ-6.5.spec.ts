// requirement: REQ-6.5
import { test, field, button, region, visible, heading, textVisible, openHome, openSecurity, newMobile, registerAccount } from "./helpers";

test('REQ-6.5: Advance to new-phone verification', async ({ page }) => {
  await openHome(page);
  const account = await registerAccount(page);
  await openSecurity(page);
  await button(region(page, 'Bound phone'), 'Change').click();
  await heading(page, 'Verify identity');
  await field(page, 'Login password').fill(account.password);
  const mobile = newMobile();
  await field(page, 'New phone').fill(mobile);
  await button(page, 'Next, verify new phone').click();
  await heading(page, 'Verify new phone');
  await visible(field(page, 'Verification code'));
  await textVisible(page, `Code sent to ${mobile}`);
});
