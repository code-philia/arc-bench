import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1
// fixtures: personal_read_account

test('REQ-5.1: Enter Personal Center', async ({ page }) => {
  await h.openPersonalCenter(page, h.FIXTURES.accounts.personalRead);
  await h.expectPersonalCenter(page);
});
