// requirement: REQ-6.6
import { test, field, button, region, visible, textVisible, textToken, openHome, openSecurity, securityChange, ACCOUNTS, SMS_CODE } from "./helpers";

test('REQ-6.6: Advance after current-email verification', async ({ page }) => {
  await openHome(page);
  await openSecurity(page, 'user');
  await (await securityChange(page, 'Bound email')).click();
  const email = ACCOUNTS.user.email.replace(/^(.).*(@[^@]+)$/, '$1***$2');
  const next = button(page, 'Next, verify new email');
  const verification = page.getByRole('dialog').or(page.locator('form, section, [role="group"]')).filter({ has: next });
  await textVisible(verification, textToken(email));
  await button(page, 'Send verification code').click();
  await field(page, 'Verification code').fill(SMS_CODE);
  await next.click();
  await visible(field(page, 'New email'));
});
