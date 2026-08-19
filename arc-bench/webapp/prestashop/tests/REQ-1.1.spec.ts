import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.1
// fixtures: public_homepage

test('REQ-1.1: View Global Navigation', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, [/logo/i, /search/i, /sign in/i, /cart/i, /language/i, /clothes/i]);
});
