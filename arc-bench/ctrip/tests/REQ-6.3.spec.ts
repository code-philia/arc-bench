// requirement: REQ-6.3
import { test, button, region, visible, textVisible, openHome, openSecurity, registerAccount } from "./helpers";

test('REQ-6.3: Inspect security settings and reminder', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openSecurity(page);
  for (const name of ['Login password', 'Bound phone', 'Bound email']) {
   await visible(region(page, name));
   await visible(button(region(page, name), 'Change'));
  }
  await textVisible(page, 'Change your password regularly');
});
