import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.2.1
// fixtures: accounts.badgeUser, badge.progress

test('REQ-8.2.1: Badge Award Notification', async ({ page }) => {
  await h.openProfile(page, h.FIXTURES.accounts.badgeUser);
  await h.expectTextsVisible(page, [/teacher|badge/i, /notification|earned/i]);
});
