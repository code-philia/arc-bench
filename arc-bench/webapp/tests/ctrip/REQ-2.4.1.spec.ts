import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.4.1
// fixtures: public_homepage, registered_account

test('REQ-2.4.1: Password Login Flow', async ({ page }) => {
  await h.ensurePasswordLogin(page);
  await h.fillPasswordLogin(page, h.FIXTURES.auth.username, h.FIXTURES.auth.password, true);
  await h.submitLogin(page);
  await h.expectLoggedInState(page);
});
