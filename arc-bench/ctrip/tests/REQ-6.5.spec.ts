// requirement: REQ-6.5
import { expect } from "@playwright/test";
import { test, field, button, visible, textVisible, openHome, openSecurity, securityChange, newMobile, registerAccount } from "./helpers";

test('REQ-6.5: Advance to new-phone verification', async ({ page }) => {
  await openHome(page);
  const account = await registerAccount(page);
  await openSecurity(page);
  await (await securityChange(page, 'Bound phone')).click();
  await expect(field(page, 'Verification code')).not.toBeVisible();
  await field(page, 'Login password').fill(account.password);
  const mobile = newMobile();
  await field(page, 'New phone').fill(mobile);
  await button(page, 'Next, verify new phone').click();
  await visible(field(page, 'Verification code'));
  await expect(field(page, 'Login password')).not.toBeVisible();
  await textVisible(page, `Code sent to ${mobile}`);
});
