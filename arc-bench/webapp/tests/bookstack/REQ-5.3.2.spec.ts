import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.2
// fixtures: sample_book, editable_book

test('REQ-5.3.2: Cancel Creating Book', async ({ page }) => {
  await h.openBookCreationFromList(page);
  await h.clickNamed(page, /^Cancel$/i);
  await h.expectTextsVisible(page, [/Books/i]);
});
