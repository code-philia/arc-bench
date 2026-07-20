import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1
// fixtures: public_homepage, authenticated_user

test('REQ-2.1: Enter Login Page', async ({ page }) => {
  await h.openLoginPage(page);
  await h.expectTextsVisible(page, [/Login/i]);
});
