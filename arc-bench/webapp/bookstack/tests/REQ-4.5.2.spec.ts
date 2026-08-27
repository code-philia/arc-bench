import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.2
// fixtures: shelf_4_5_2

test('REQ-4.5.2: Cancel Shelf Edits', async ({ page }) => {
  await h.openShelfDetails(page, h.FIXTURES.shelves.editCancel.name);
  await h.clickNamed(page, /^Edit$/i);
  await h.clickNamed(page, /^Cancel$/i);
  await h.expectTextsVisible(page, [h.FIXTURES.shelves.editCancel.name]);
});
