import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.1
// fixtures: sample_shelf, editable_shelf

test('REQ-4.5.1: Save Shelf Edits', async ({ page }) => {
  await h.openShelfDetails(page);
  await h.clickNamed(page, /^Edit$/i);
  await h.fillShelfForm(page, 'edit');
  await h.clickNamed(page, /Save Shelf/i);
  await h.expectTextsVisible(page, [h.FIXTURES.shelf.updatedName]);
});
