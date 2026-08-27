import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.1
// fixtures: shelf_4_4_1

test('REQ-4.4.1: Confirm Delete Shelf', async ({ page }) => {
  await h.openShelfDetails(page, h.FIXTURES.shelves.deleteConfirm.name);
  await h.clickNamed(page, /^Delete$/i);
  await h.clickNamed(page, /Confirm|Delete/i);
  await h.expectTextsVisible(page, [/Shelves/i]);
});
