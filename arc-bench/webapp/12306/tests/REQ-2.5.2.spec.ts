import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.2
// fixtures: public_homepage

test('REQ-2.5.2: Open the privacy policy page from the registration page', async ({ page }) => {
  await h.openRegistrationPage(page);
  await h.clickNamed(page, 'Privacy Policy');
  await h.expectTextsVisible(page, ['Privacy Policy']);
});
