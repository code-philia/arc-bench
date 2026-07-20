import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.1
// fixtures: public_homepage

test('REQ-1.1: Display the default home page', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, ['Login', 'Register', 'My 12306', 'Home', /Booking/i, /Travel guides?/i, 'Quick Guide']);
  await h.expectQuickSearch(page);
});
