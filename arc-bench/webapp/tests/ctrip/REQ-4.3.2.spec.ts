import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.2
// fixtures: booking_user, booking_page_dataset

test('REQ-4.3.2: Select Payment Method', async ({ page }) => {
  await h.openPaymentPage(page);
  await h.clickFirstAvailable(page, [[/支付宝/, /微信/, /银行卡/, /Alipay/i, /WeChat/i, /bank/i]]);
  await h.clickFirstAvailable(page, [[/支付/, /pay/i, /立即支付/]]);
  await h.expectAnyVisible(page, [[/成功/, /支付成功/, /success/i]]);
});
