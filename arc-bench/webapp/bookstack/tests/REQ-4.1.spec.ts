import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1
// fixtures: sample_shelf

test('REQ-4.1: View Shelf List', async ({ page }) => {
  await h.openShelves(page);
  await h.expectTextsVisible(page, [h.FIXTURES.shelf.name]);
});
