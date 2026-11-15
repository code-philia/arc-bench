import { generateBookData } from './fixtures/data';
// requirement: REQ-5.5
import { test } from '@playwright/test';
import { enter, heading, text, go, createBook, openBook, bookActions, deletionConfirmation, collection } from './helpers';

test("REQ-5.5: Confirm deletion", async ({ page }) => {
  await enter(page);
  const bookData = generateBookData({ prefix: 'Book 5.5.1' });
  const name = await createBook(page, bookData);
  await openBook(page, name);
  await bookActions(page, name).action('Delete Book').activate();
  await deletionConfirmation(page, name).action('Confirm Delete').activate();
  await heading(page, 'Books');
  await page.reload();
  await go(page, 'Books');
  await collection(page, 'Book list').item(name).expectCount(0);
});

test("REQ-5.5: Cancel deletion", async ({ page }) => {
  await enter(page);
  const bookData = generateBookData({ prefix: 'Book 5.5.2' });
  const name = await createBook(page, bookData);
  await openBook(page, name);
  await bookActions(page, name).action('Delete Book').activate();
  await deletionConfirmation(page, name).action('Cancel').activate();
  await heading(page, name);
  await text(page, bookData.description, name);
});
