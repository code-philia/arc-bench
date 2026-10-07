// requirement: REQ-2.2
import { test, expect } from '@playwright/test';
import { ACCOUNT, identity, enter, login } from './helpers';

test("REQ-2.2: Log in with remember me", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  await login(page, true);
  await expect(page.getByText(ACCOUNT.nickname, { exact: true })).toBeVisible();
});
