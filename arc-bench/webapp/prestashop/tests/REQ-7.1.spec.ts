import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.1
// fixtures: public_homepage

test('REQ-7.1: Enter Login Page', async ({ page }) => {
  await h.openSignIn(page);
  await h.expectTextsVisible(page, [/sign in/i, /email/i]);
});
