import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.2
// fixtures: shelf_7_2

test('REQ-7.2: Quick Navigation from Recently Viewed', async ({ page }) => {
  await h.openShelfDetails(page, h.FIXTURES.shelves.recentlyViewedNavigation.name);
  await h.returnHomeByLogo(page);
  await h.clickNamed(page, h.FIXTURES.shelves.recentlyViewedNavigation.name);
  await h.expectTextsVisible(page, [h.FIXTURES.shelves.recentlyViewedNavigation.name]);
});
