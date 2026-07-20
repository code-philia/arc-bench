import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1
// fixtures: public_homepage

test('REQ-2.1: Browse Homepage', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, [/carousel/i, /popular products/i, /newsletter/i, /footer/i]);
});
