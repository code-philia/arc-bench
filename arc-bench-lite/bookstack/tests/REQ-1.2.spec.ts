import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.2
// fixtures: public_homepage

test('REQ-1.2: Back to Homepage from Other Pages', async ({ page }) => {
  await h.openShelves(page);
  await h.returnHomeByLogo(page);
  await h.expectTextsVisible(page, [/BookStack/i]);
});
