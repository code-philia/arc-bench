import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.1
// fixtures: sample_shelf, editable_shelf

test('REQ-4.4.1: Confirm Delete Shelf', async ({ page }) => {
  await h.openShelfDetails(page);
  await h.clickNamed(page, /^Delete$/i);
  await h.clickNamed(page, /Confirm|Delete/i);
  await h.expectTextsVisible(page, [/Shelves/i]);
});
