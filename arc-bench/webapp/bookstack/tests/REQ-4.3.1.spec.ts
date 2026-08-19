import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.1
// fixtures: sample_shelf, editable_shelf

test('REQ-4.3.1: Create Shelf', async ({ page }) => {
  await h.openShelfDetails(page);
  await h.clickNamed(page, /New Shelf/i);
  await h.fillShelfForm(page, 'create');
  await h.clickNamed(page, /Save Shelf/i);
  await h.expectTextsVisible(page, [h.FIXTURES.shelf.name]);
});
