import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.3.3
// fixtures: public_homepage

test('REQ-2.3.3: Switch to Password Login', async ({ page }) => {
  await h.ensureCodeLogin(page);
  await h.clickFirstAvailable(page, [[/账号登录/, /password login/i]]);
  await h.expectPasswordLoginForm(page);
});
