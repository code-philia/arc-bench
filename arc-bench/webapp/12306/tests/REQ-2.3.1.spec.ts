import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.3.1
// fixtures: registered_user

test('REQ-2.3.1: Sign out from the home page', async ({ page }) => {
  await h.loginAs(page);
  await h.logout(page);
  await h.expectSuccessFeedback(page);
  await h.expectTextsVisible(page, ['Login', 'Register']);
});
