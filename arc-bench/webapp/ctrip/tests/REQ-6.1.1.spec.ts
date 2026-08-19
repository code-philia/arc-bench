import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1.1
// fixtures: profile_user

test('REQ-6.1.1: View Basic Profile Information', async ({ page }) => {
  await h.openProfileOverview(page);
  await h.expectAnyVisible(page, [[/手机号/, /mobile/i], [/邮箱/, /email/i], [/\*\*\*|\*\*\*\*/, /masked/i]]);
});
