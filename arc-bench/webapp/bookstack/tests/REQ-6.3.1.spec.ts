import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.1
// fixtures: book_6_3_1, page_6_3_1

test('REQ-6.3.1: Enter Page Reading Page', async ({ page }) => {
  await h.openPageReading(page, h.FIXTURES.books.pageRead.name, h.FIXTURES.books.pageRead.pageName);
  await h.expectTextsVisible(page, [h.FIXTURES.books.pageRead.pageName]);
});
