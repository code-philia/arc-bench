import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.1
// fixtures: public_homepage, search_index

test('REQ-7.1: Basic Search', async ({ page }) => {
  await h.openHome(page);
  await h.fillField(page, [/search/i], 'react state');
  await h.expectTextsVisible(page, [/react/i, /state/i]);
  await h.pressEnter(page, [/search/i]);
  await h.expectTextsVisible(page, [/results/i, /react/i]);
});
