import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2
// fixtures: personal_center_user

test('REQ-5.2: Expand/Collapse Common Information', async ({ page }) => {
  await h.expandCommonInformation(page);
  await h.expectAnyVisible(page, [[/常用旅客信息/, /traveler/i], [/常用联系人/, /contact/i], [/常用报销凭证/, /invoice/i], [/常用地址/, /address/i]]);
  await h.clickFirstAvailable(page, [[/常用信息/, /common information/i]]);
  await h.expectVisible(page, [/常用信息/, /common information/i]);
});
