import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.1
// fixtures: shelf_7_1

test('REQ-7.1: Add to Recently Viewed', async ({ page }) => {
  await h.openShelfDetails(page, h.FIXTURES.shelves.recentlyViewed.name);
  await h.returnHomeByLogo(page);
  await h.expectTextsVisible(page, ['My Recently Viewed', h.FIXTURES.shelves.recentlyViewed.name]);
});
