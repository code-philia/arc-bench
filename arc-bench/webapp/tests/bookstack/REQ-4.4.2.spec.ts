import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.2
// fixtures: sample_shelf, editable_shelf

test('REQ-4.4.2: Cancel Delete Shelf', async ({ page }) => {
  await h.openShelfDetails(page);
  await h.clickNamed(page, /^Delete$/i);
  await h.clickNamed(page, /^Cancel$/i);
  await h.expectTextsVisible(page, [h.FIXTURES.shelf.name]);
});
