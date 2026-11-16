// requirement: REQ-1.13
import { expect } from "@playwright/test";
import { test, setChecked, field, action, checkbox, visible, openHome, smsLoginForm, SMS_CODE, loginSubmit, createMobileAccount } from "./helpers";

test('REQ-1.13: Require a sent code before SMS authentication', async ({ page }) => {
  await openHome(page);
  const { mobile } = await createMobileAccount(page);
  await openHome(page);
  await smsLoginForm(page);
  await field(page, 'Mobile number').fill(mobile);
  await field(page, 'Verification code').fill(SMS_CODE);
  await setChecked(checkbox(page, 'Agree to terms'));
  await loginSubmit(page).click();
  await visible(page.getByRole('alert'));
  await visible(field(page, 'Mobile number'));
  await expect(action(page, 'My account')).toHaveCount(0);
});
