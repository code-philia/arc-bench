import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.1
// fixtures: recently_viewed_content

test('REQ-7.1: Add to Recently Viewed', async ({ page }) => {
  await h.openShelfDetails(page);
  await h.returnHomeByLogo(page);
  await h.expectTextsVisible(page, ['My Recently Viewed', h.FIXTURES.shelf.name]);
});
