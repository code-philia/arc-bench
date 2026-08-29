import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.2
// fixtures: public_homepage

test('REQ-2.5.2: Exception: Mobile Number Missing', async ({ page }) => {
  await h.ensureCodeLogin(page);
  await h.clickFirstAvailable(page, [[/发送验证码/, /send code/i]]);
  await h.expectErrorFeedback(page, [/请输入手机号/, /mobile/i]);
});
