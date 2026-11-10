import { generateBookData } from './fixtures/data';
// requirement: REQ-5.3
import { test } from '@playwright/test';
import { expectMetadata, enter, heading, text, metadata, beginBook, createBook, action, collection } from './helpers';

test("REQ-5.3: Save a new book", async ({ page }) => {
  await enter(page);
  const bookData = generateBookData({ prefix: 'Book Created 5.3.1' });
  const name = await createBook(page, bookData);
  await heading(page, name);
  await text(page, bookData.description, name);
  await page.reload();
  await action(page, 'Edit').activate();
  await expectMetadata(page, name, bookData.description, bookData.tags);
});

test("REQ-5.3: Cancel new book", async ({ page }) => {
  await enter(page);
  await beginBook(page);
  const newData = generateBookData({ prefix: 'Book Cancelled 5.3.2' });
  const name = newData.name;
  await metadata(page, name, newData.description, newData.tags);
  await action(page, 'Cancel').activate();
  await heading(page, 'Books');
  await collection(page, 'Book list').item(name).expectCount(0);
});
