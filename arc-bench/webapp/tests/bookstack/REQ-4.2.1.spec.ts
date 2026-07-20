import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.1
// fixtures: sample_shelf

test('REQ-4.2.1: Enter Shelf Details Page', async ({ page }) => {
  await h.openShelfDetails(page);
  await h.expectTextsVisible(page, [h.FIXTURES.shelf.name]);
});
