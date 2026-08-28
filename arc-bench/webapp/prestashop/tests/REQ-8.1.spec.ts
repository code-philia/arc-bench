import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.1
// fixtures: accounts.login

test('REQ-8.1: Enter My Account', async ({ page }) => {
  await h.openMyAccount(page, h.FIXTURES.accounts.login);
  await h.expectTextsVisible(page, [/my account/i, /information|addresses|orders/i]);
});
