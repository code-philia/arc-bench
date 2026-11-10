import { generateBookData, generateShelfData } from './fixtures/data';
// requirement: REQ-5.2
import { test } from '@playwright/test';
import { text, enter, heading, createShelf, createBook, openBook, createShelfBook, objectNavigation, collection } from './helpers';

test("REQ-5.2: Open from global list", async ({ page }) => {
  await enter(page);
  const bookData = generateBookData({ prefix: 'Book 5.2.1' });
  const name = await createBook(page, bookData);
  await openBook(page, name);
  await heading(page, name);
  await text(page, bookData.description, name);
});

test("REQ-5.2: Open from containing shelf", async ({ page }) => {
  await enter(page);
  const shelfData = generateShelfData({ prefix: 'Shelf 5.2.2' });
  const shelf = await createShelf(page, shelfData);
  const bookData = generateBookData({ prefix: 'Book 5.2.2', shelfName: shelf });
  const book = await createShelfBook(page, bookData);
  await objectNavigation(page, shelf).open();
  await collection(page, 'Book list', { owner: shelf }).item(book).open();
  await heading(page, book);
  await text(page, bookData.description, book);
});
