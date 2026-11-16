// requirement: REQ-6.2
import { test, textVisible, openHome, openPersonal, registerAccount, profileInput, editProfile } from "./helpers";

test('REQ-6.2: Persist edited profile fields', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openPersonal(page);
  const profile = profileInput();
  await editProfile(page, profile);
  for (const value of Object.values(profile)) await textVisible(page, value);
  await page.reload();
  for (const value of Object.values(profile)) await textVisible(page, value);
});
