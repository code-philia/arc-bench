import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.1
// fixtures: shelf_4_2_1

test('REQ-4.2.1: Enter Shelf Details Page', async ({ page }) => {
  await h.openShelfDetails(page, h.FIXTURES.shelves.details.name);
  await h.expectTextsVisible(page, [h.FIXTURES.shelves.details.name]);
});
