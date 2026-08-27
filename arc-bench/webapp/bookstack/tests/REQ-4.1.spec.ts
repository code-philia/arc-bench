import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1
// fixtures: shelf_4_1

test('REQ-4.1: View Shelf List', async ({ page }) => {
  await h.openShelves(page);
  await h.expectTextsVisible(page, [h.FIXTURES.shelves.list.name]);
});
