import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-0
// fixtures: public_homepage

test('REQ-0: Visit Homepage', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, [/carousel/i, /popular products/i, /search/i]);
});
