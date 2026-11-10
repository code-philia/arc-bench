// requirement: REQ-2.2
import { test } from '@playwright/test';
import { ACCOUNT, enter, login, accountIdentity, collection } from './helpers';

test("REQ-2.2: Log in with remember me", async ({ page }) => {
  await enter(page);
  await login(page, true);
  await accountIdentity(page, ACCOUNT.nickname).expectVisible();
  await collection(page, 'My Recent Drafts').expectVisible();
});
