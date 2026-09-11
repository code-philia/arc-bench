import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.1
// fixtures: shelf_4_3_1

test('REQ-4.3.1: Create Shelf', async ({ page }) => {
  await h.openShelfDetails(page, h.FIXTURES.shelves.create.contextName);
  await h.clickNamed(page, /New Shelf/i);
  await h.fillShelfForm(page, h.FIXTURES.shelves.create, 'create');
  await h.clickNamed(page, /Save Shelf/i);
  await h.expectTextsVisible(page, [h.FIXTURES.shelves.create.name]);
});
