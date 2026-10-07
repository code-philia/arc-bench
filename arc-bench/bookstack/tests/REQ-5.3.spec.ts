// requirement: REQ-5.3
import { test, expect } from '@playwright/test';
import { expectMetadata, identity, named, enter, region, entry, button, heading, text, metadata, beginBook, createBook } from './helpers';

test("REQ-5.3: Save a new book", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const name = await createBook(page, id, 'Book Created 5.3.1', 'Book created by corresponding prerequisite behavior.', 'created, book');
  await heading(page, name);
  await text(page, 'Book created by corresponding prerequisite behavior.');
  await page.reload();
  await button(page, 'Edit').click();
});

test("REQ-5.3: Cancel new book", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  await beginBook(page);
  const name = named(id, 'Book Cancelled 5.3.2');
  await metadata(page, name, 'Unsaved book description 5.3.2.', 'cancelled, book');
  await button(page, 'Cancel').click();
  await heading(page, 'Books');
  await expect(entry(region(page, 'Book list'), name)).toHaveCount(0);
});
