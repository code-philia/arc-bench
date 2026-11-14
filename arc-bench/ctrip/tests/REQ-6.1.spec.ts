// requirement: REQ-6.1
import { test, textVisible, openHome, openPersonal, profileInput, editProfile, ACCOUNTS } from "./helpers";

test('REQ-6.1: Read personal information with masking', async ({ page }) => {
  await openHome(page);
  await openPersonal(page, 'profile_read');
  const profile = profileInput();
  const { mobile, email } = ACCOUNTS.profile_read;
  const maskedMobile = mobile!.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
  const maskedEmail = email.replace(/^(.).*(@[^@]+)$/, '$1***$2');
  await editProfile(page, profile);
  await page.reload();
  for (const value of [maskedMobile, maskedEmail, ...Object.values(profile)]) {
    await textVisible(page, value);
  }
});
