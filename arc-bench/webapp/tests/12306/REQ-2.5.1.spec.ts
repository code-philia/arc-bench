import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.5.1
// fixtures: public_homepage

test('REQ-2.5.1: Open the terms of service page from the registration page', async ({ page }) => {
  await h.openRegistrationPage(page);
  await h.clickNamed(page, 'Terms of Service');
  await h.expectTextsVisible(page, ['Terms of Service']);
});
