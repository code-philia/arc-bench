import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.1
// fixtures: none

test('REQ-5.3.1: Fill out and Save Book', async ({ page }) => {
  await h.openBookCreationFromList(page);
  await h.fillBookForm(page, h.FIXTURES.books.createFromList, 'create');
  await h.clickNamed(page, /Save Book/i);
  await h.expectTextsVisible(page, [h.FIXTURES.books.createFromList.name]);
});
