import { generateBookData, generateShelfData } from './fixtures/data';
// requirement: REQ-5.6
import { test } from '@playwright/test';
import { enter, heading, createShelf, createShelfBook, objectNavigation, collection } from './helpers';

test("REQ-5.6: Save a book with shelf association", async ({ page }) => {
  await enter(page);
  const shelfData = generateShelfData({ prefix: 'Shelf 5.6.1' });
  const shelf = await createShelf(page, shelfData);
  const bookData = generateBookData({ prefix: 'Book Created 5.6.1', shelfName: shelf });
  const book = await createShelfBook(page, bookData);
  await heading(page, book);
  await objectNavigation(page, shelf).open();
  await heading(page, shelf);
  await collection(page, 'Book list', { owner: shelf }).item(book).expectVisible();
});
