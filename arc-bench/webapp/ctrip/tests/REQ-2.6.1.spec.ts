import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6.1
// fixtures: public_homepage, registration_candidate

test('REQ-2.6.1: Enter Registration Page', async ({ page }) => {
  await h.openHome(page);
  await h.clickFirstAvailable(page, [[/注册/, /register/i, /sign up/i]]);
  await h.expectAnyVisible(page, [[/注册/, /register/i], [/手机号/, /mobile/i, /验证/i]]);
});
