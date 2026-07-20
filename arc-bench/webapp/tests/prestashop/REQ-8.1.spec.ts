import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.1
// fixtures: registered_user

test('REQ-8.1: Enter My Account', async ({ page }) => {
  await h.openMyAccount(page);
  await h.expectTextsVisible(page, [/my account/i, /information|addresses|orders/i]);
});
