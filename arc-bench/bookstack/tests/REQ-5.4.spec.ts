import { generateBookData } from './fixtures/data';
// requirement: REQ-5.4
import { test } from '@playwright/test';
import { expectMetadata, enter, heading, text, metadata, createBook, openBook, action, detailContent } from './helpers';

test("REQ-5.4: Save metadata changes", async ({ page }) => {
  await enter(page);
  const bookData = generateBookData({ prefix: 'Book 5.4.1' });
  const original = await createBook(page, bookData);
  await openBook(page, original);
  await action(page, 'Edit').activate();
  await expectMetadata(page, original, bookData.description, bookData.tags);
  const updatedData = generateBookData({ prefix: 'Book Updated 5.4.1' });
  const updated = updatedData.name;
  await metadata(page, updated, updatedData.description, bookData.tags);
  await action(page, 'Save Book').activate();
  await heading(page, updated);
  await text(page, updatedData.description, updated);
  await page.reload();
  await heading(page, updated);
  await text(page, updatedData.description, updated);
  await action(page, 'Edit').activate();
  await expectMetadata(page, updated, updatedData.description, bookData.tags);
});

test("REQ-5.4: Cancel metadata changes", async ({ page }) => {
  await enter(page);
  const bookData = generateBookData({ prefix: 'Book 5.4.2' });
  const original = await createBook(page, bookData);
  await openBook(page, original);
  await action(page, 'Edit').activate();
  await expectMetadata(page, original, bookData.description, bookData.tags);
  const updatedData = generateBookData({ prefix: 'Book Updated 5.4.2' });
  const updated = updatedData.name;
  await metadata(page, updated, updatedData.description, bookData.tags);
  await action(page, 'Cancel').activate();
  await heading(page, original);
  await text(page, bookData.description, original);
  await detailContent(page, original, updated).expectAbsent();
  await action(page, 'Edit').activate();
  await expectMetadata(page, original, bookData.description, bookData.tags);
});
