import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.2.1
// fixtures: registered_user, badge_progress

test('REQ-8.2.1: Badge Award Notification', async ({ page }) => {
  await h.openProfile(page);
  await h.expectTextsVisible(page, [/teacher|badge/i, /notification|earned/i]);
});
