import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.7.1
// fixtures: password_login_account

test('REQ-2.7.1: Log Out', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.passwordLogin);
  await h.hoverIfVisible(page, [/尊敬的/, /我的携程/, /account/i]);
  await h.clickFirstAvailable(page, [[/退出登录/, /sign out/i, /log out/i]]);
  await h.expectAnyVisible(page, [[/登录/, /^login$/i, /sign in/i]]);
});
