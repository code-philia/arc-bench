import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.2
// fixtures: public_homepage, homepage_questions

test('REQ-1.2: Global Navigation Header', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, [/stack overflow/i, /search/i, /products/i, /log in|sign up/i]);
});
