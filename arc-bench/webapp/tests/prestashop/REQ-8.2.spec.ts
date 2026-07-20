import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.2
// fixtures: registered_user

test('REQ-8.2: Account Overview', async ({ page }) => {
  await h.openMyAccount(page);
  await h.expectTextsVisible(page, [/order history/i, /addresses/i, /information/i]);
});
