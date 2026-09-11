import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.1
// fixtures: shelf_4_5_1

test('REQ-4.5.1: Save Shelf Edits', async ({ page }) => {
  await h.openShelfDetails(page, h.FIXTURES.shelves.editSave.name);
  await h.clickNamed(page, /^Edit$/i);
  await h.fillShelfForm(page, h.FIXTURES.shelves.editSave, 'edit');
  await h.clickNamed(page, /Save Shelf/i);
  await h.expectTextsVisible(page, [h.FIXTURES.shelves.editSave.updatedName]);
});
