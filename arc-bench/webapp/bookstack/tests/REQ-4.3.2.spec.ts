import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.2
// fixtures: shelf_4_3_2

test('REQ-4.3.2: Cancel Creation', async ({ page }) => {
  await h.openShelfDetails(page, h.FIXTURES.shelves.cancelCreate.contextName);
  await h.clickNamed(page, /New Shelf/i);
  await h.clickNamed(page, /^Cancel$/i);
  await h.expectTextsVisible(page, [h.FIXTURES.shelves.cancelCreate.contextName]);
});
