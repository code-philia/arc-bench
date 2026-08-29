import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1.1
// fixtures: profile_read_account, profile_read_dataset

test('REQ-6.1.1: View Basic Profile Information', async ({ page }) => {
  await h.openProfileOverview(page, h.FIXTURES.accounts.profileRead);
  await h.expectAnyVisible(page, [[/手机号/, /mobile/i], [/邮箱/, /email/i], [/\*\*\*|\*\*\*\*/, /masked/i]]);
});
