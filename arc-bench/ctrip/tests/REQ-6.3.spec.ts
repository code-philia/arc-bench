// requirement: REQ-6.3
import { test, visible, textVisible, openHome, openSecurity, securityChange, registerAccount } from "./helpers";

test('REQ-6.3: Inspect security settings and reminder', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openSecurity(page);
  for (const name of ['Login password', 'Bound phone', 'Bound email'] as const) {
    await visible(await securityChange(page, name));
  }
  await textVisible(page, /(?:change your password regularly|定期(?:更换|修改)(?:密码)?)/i);
});
