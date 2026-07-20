import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.6.2.2
// fixtures: personal_center_user, invoice_title_records

test('REQ-5.6.2.2: Configure Special VAT Invoice', async ({ page }) => {
  await h.openInvoiceManager(page);
  await h.clickFirstAvailable(page, [[/新增/, /add/i, /新建/]]);
  await h.setCheckbox(page, [/增值税专票/, /VAT/i], true);
  await h.expectAnyVisible(page, [[/注册地址/, /address/i], [/电话/, /phone/i], [/开户银行/, /bank/i], [/银行账号/, /account/i]]);
});
