import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.3
// fixtures: registration_candidate

test('REQ-7.3: User Registration', async ({ page }) => {
  await h.openSignIn(page);
  await h.clickFirstAvailable(page, [[/no account\? create one here/i, /create one here/i]]);
  await h.expectTextsVisible(page, [/first name/i, /last name/i, /birthday/i]);
  await h.setRadio(page, [/mr\.?/i]);
  await h.fillField(page, [/first name/i], 'New');
  await h.fillField(page, [/last name/i], 'Customer');
  await h.fillField(page, [/email/i], 'new_customer@example.com');
  await h.fillField(page, [/password/i], 'ShopPass123!');
  await h.fillField(page, [/birthdate|birthday/i], '1995-08-21');
  await h.setCheckbox(page, [/receive offers/i], true);
  await h.setCheckbox(page, [/newsletter/i], true);
  await h.setCheckbox(page, [/terms/i], true);
  await h.clickFirstAvailable(page, [[/save/i]]);
  await h.expectTextsVisible(page, [/my account|sign out/i]);
});
