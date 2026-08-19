import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2
// fixtures: public_homepage, authenticated_user

test('REQ-2.2: Log In Successfully', async ({ page }) => {
  await h.login(page);
  await h.expectTextsVisible(page, [h.FIXTURES.auth.nickname]);
});
