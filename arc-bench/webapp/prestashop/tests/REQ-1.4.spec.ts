import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.4
// fixtures: public_homepage, searchable_catalog

test('REQ-1.4: Search Function', async ({ page }) => {
  await h.openHome(page);
  await h.clickFirstAvailable(page, [[/search/i]]);
  await h.fillField(page, [/search/i], h.FIXTURES.catalog.searchKeyword);
  await h.expectTextsVisible(page, [/shirt/i]);
  await h.pressEnter(page, [/search/i]);
  await h.expectTextsVisible(page, [/shirt/i, /results|products/i]);
});
