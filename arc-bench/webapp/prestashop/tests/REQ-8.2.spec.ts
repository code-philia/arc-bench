import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.2
// fixtures: accounts.login

test('REQ-8.2: Account Overview', async ({ page }) => {
  await h.openMyAccount(page, h.FIXTURES.accounts.login);
  await h.expectTextsVisible(page, [/order history/i, /addresses/i, /information/i]);
});
