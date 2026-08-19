import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.5
// fixtures: public_homepage

test('REQ-1.5: User Entry', async ({ page }) => {
  await h.openSignIn(page);
  await h.expectTextsVisible(page, [/sign in/i, /email/i, /password/i]);
});
