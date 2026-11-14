// requirement: REQ-1.8
import { test, action, openHome, signedOut, registerAccount } from "./helpers";

test('REQ-1.8: Log out and retain signed-out state', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await action(page, 'My account').hover();
  await action(page, 'Log out').click();
  await signedOut(page);
  await page.reload();
  await signedOut(page);
});
