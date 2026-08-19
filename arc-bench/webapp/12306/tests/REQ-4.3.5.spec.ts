import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.5
// fixtures: profile_user

test('REQ-4.3.5: Open and view the account security page', async ({ page }) => {
  await h.openAccountSecurity(page);
  await h.expectTextsVisible(page, ['Login password', 'Security mailbox', 'Mobile number']);
});
