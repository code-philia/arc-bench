import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.2
// fixtures: sample_shelf, editable_shelf

test('REQ-4.5.2: Cancel Shelf Edits', async ({ page }) => {
  await h.openShelfDetails(page);
  await h.clickNamed(page, /^Edit$/i);
  await h.clickNamed(page, /^Cancel$/i);
  await h.expectTextsVisible(page, [h.FIXTURES.shelf.name]);
});
