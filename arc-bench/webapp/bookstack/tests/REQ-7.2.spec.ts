import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.2
// fixtures: recently_viewed_content

test('REQ-7.2: Quick Navigation from Recently Viewed', async ({ page }) => {
  await h.openShelfDetails(page);
  await h.returnHomeByLogo(page);
  await h.clickNamed(page, h.FIXTURES.shelf.name);
  await h.expectTextsVisible(page, [h.FIXTURES.shelf.name]);
});
