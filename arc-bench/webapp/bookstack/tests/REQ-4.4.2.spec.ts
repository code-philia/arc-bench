import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.2
// fixtures: shelf_4_4_2

test('REQ-4.4.2: Cancel Delete Shelf', async ({ page }) => {
  await h.openShelfDetails(page, h.FIXTURES.shelves.deleteCancel.name);
  await h.clickNamed(page, /^Delete$/i);
  await h.clickNamed(page, /^Cancel$/i);
  await h.expectTextsVisible(page, [h.FIXTURES.shelves.deleteCancel.name]);
});
